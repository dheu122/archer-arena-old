// This is the compiled game. Should be empty for now.
var socket = io();

// Global room id when joining, this will help tell the client which room and
// which players it will associate with
var globalRoomId;
var globalClientId;

///////////////////////////////////////////////// Function that loads the map .json file

function loadJSON(url, onsuccess) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if ((request.readyState == 4) && (request.status == 200)) // if DONE and SUCCESS
	  JsonMap.render(JSON.parse(request.responseText));
  }
  request.open("GET", url + ".json", true);
  request.send();
}




///////////////////////////////////////////////// SOUND FUNCTION
var titleMusic = new sound("assets/TitleMusic2.wav");
var gameMusic = new sound("assets/BackgroundMusicNoCrow.wav");

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
} 

var isTitlescreen = true;


function gameMusicPlayer() {
	gameMusic.play();
}

function titleMusicPlayer() {
	titleMusic.play();
}
	
	
function donePlaying() { //checks if the music has finished playing, then if true it plays it again

	if (isTitlescreen == true) {
		if (titleMusic.paused = true) {
		titleMusicPlayer(); 
		}
	}
	else if (isTitlescreen == false) {
		
			titleMusic.stop();
			
			if (gameMusic.paused = true) {
				gameMusicPlayer();
			}
		}
}

/////////////////////////////////////////////////

var canvasScreen = new Renderer.Screen;

// Creates a new player 'character', and renders a sprite
var player = new Logic.character({
	name: '',
	id: '',
	isInThisRoom: '',
  camera: new Renderer.Camera({
  }),
	sprite: new Renderer.Sprite({
		image: Renderer.Images.player,
		width: 15,
		height: 16,
		isSpriteSheet: true,
		x: 0,
		y: 0,
		index: 0,
	}),
	speed: 2,
	minSpeed: 2,
	maxSpeed: 2.5,
	stamina: 100,
	score: 0,
});

var leaderboard = new Logic.leaderboard({

});

// Map for debugging, remove later
var debugMap = { 
	sprite: new Renderer.Sprite({
		image: '../../assets/map_debug.png',
		width: 619,
		height: 620,
		isSpriteSheet: false,
		x: 0,
		y: 0
	})
}

window.onload = function() {
	//loadJSON('/assets/TesterProper', gameLoop); //calls JSON

	socket.on('JoinedRoom', function(identity) {
		isTitlescreen = false;
		globalRoomId = identity.roomId;
		globalClientId = identity.id;
		player.isInThisRoom = identity.roomId;
		player.id = identity.id;
		player.name = identity.name;
	});

	socket.on('GetRoomPlayerData', function(playerData) {
		//console.log(playerData);
		//ctx.clearRect(-100, -100, canvas.width, canvas.height);
		updatePlayers(playerData);
	});

	//sets camera position to (0,0) located at top left corner of the map
  //Eventually will set to the players random spawn position.
  player.camera.initialize();

	socket.on('GetRoomArrowData', function(arrowData) {
		//ctx.clearRect(-100, -100, canvas.width, canvas.height);
		updateArrows(arrowData);
	})

	socket.on('PlayerWasKilled', function(collision) {
		//console.log(collision);
		console.log(collision.playerWhoKilled.name + " Killed " + collision.playerWhoDied.name);
		//leaderboard.addScore(collision.playerWhoKilled, collision.playerWhoDied);
	})

	socket.on('YouDied', function() {
		console.log('You died');
	})

	socket.on('YouKilled', function() {
		player.score++;
		console.log('You killed someone');
	})
	gameLoop();
}

function updatePlayers(playerData) {
	//debugMap.render();
	//JsonMap.render(JsonMap.jsonMap);
	var players = [];
	for(var i = 0; i < playerData.length; i++) {
		var data = playerData[i];
		var player =  new Logic.character({
			name: data.name,
			id: data.id,
			isInThisRoom: data.isInThisRoom,
			sprite: new Renderer.Sprite({
				image: Renderer.Images.player,
				width: 15,
				height: 16,
				isSpriteSheet: true,
				x: data.sprite.x,
				y: data.sprite.y,
				index: data.sprite.index
			}),
			speed: 2,
			minSpeed: 2,
			maxSpeed: 2.5,
			stamina: 100,
			score: data.score,
		});
		//player.sprite.render();
		players.push(player);
	}
	canvasScreen.order.players = players;
}

function updateArrows(arrowData) {
	var arrows = [];
	for(var i = 0; i < arrowData.length; i++) {
		var data = arrowData[i];
		var arrow = new Logic.arrow({
			sprite: new Renderer.Sprite({
				image: Renderer.Images.arrow,
				width: 16,
				height: 16,
				isSpriteSheet: true,
				x: data.sprite.x,
				y: data.sprite.y,
				index: data.sprite.index
			}),
			
			id: data.id,
			arrowSpeedX: data.arrowSpeedX,
			arrowSpeedY: data.arrowSpeedY,   
			angle: data.angle,
			belongsTo: data.belongsTo,
			isInThisRoom: data.isInThisRoom, 
			lifetime: data.lifetime,
		});
		//arrow.sprite.render();
		arrows.push(arrow);
	}
	canvasScreen.order.arrows = arrows;
}
// Clears the screen
// Calls the player's update() function and redraws itself
// Repeat
var lastLoopRun = 0;
function gameLoop() { //this is the main game loop, i found a version of it in a tutorial, basically repeats every 2 miliseconds and runs at 33 fps 1000ms/30 = 33.3
	if (new Date().getTime() - lastLoopRun > 15) {
		donePlaying();
		if(globalRoomId) {
			var data = {
				playerData: player,
				roomId: globalRoomId
			}

			player.update();					// Updates current client to itself
			player.camera.calculatePostition(player.sprite.x, player.sprite.y); //sets camera to the position passed in here
			canvasScreen.renderInOrder();
			socket.emit('SendArrowData', data);	
		  	socket.emit('SendPlayerData', data); 		// Send current client's data to everyone, so they can update
			lastLoopRun = new Date().getTime();
		}
	}

	setTimeout('gameLoop();', 1000 / 60);
}

setInterval(function() {
	if(globalRoomId) {
		socket.emit('CheckCollision', globalRoomId);
	}
}, 1000 / 10);
