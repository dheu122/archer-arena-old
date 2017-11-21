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
var titleMusic = new sound("assets/music/TitleMusic2.wav");
var gameMusic = new sound("assets/music/BackgroundMusicNoCrow.wav");

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
	isDead: false,
	characterIndex: 0,
	camera: new Renderer.Camera({
		enabled: true
	}),
	sprite: new Renderer.Sprite({
		image: Renderer.Images.players[0],
		width: 15,
		height: 16,
		isSpriteSheet: true,
		x: Math.floor((Math.random() * 1000) + 100),	// Hard-coded these values, CHANGEME
		y: Math.floor((Math.random() * 1000) + 100),
		index: 0,
	}),
	speed: 2,
	minSpeed: 2,
	maxSpeed: 2.5,
	stamina: 100,
	score: 0
});

//sets camera position to (0,0) located at top left corner of the map
//Eventually will set to the players random spawn position.
player.camera.initialize();

var leaderboard = new Logic.leaderboard({

});

window.onload = function() {

	socket.on('JoinedRoom', function(identity) {
		isTitlescreen = false;
		globalRoomId = identity.roomId;
		globalClientId = identity.id;
		player.characterIndex = identity.characterIndex;
		player.isInThisRoom = identity.roomId;
		player.id = identity.id;
		player.name = identity.name;
	});

	socket.on('GetRoomPlayerData', function(playerData) {
		//console.log(playerData);
		//ctx.clearRect(-100, -100, canvas.width, canvas.height);
		updatePlayers(playerData);
	});

	socket.on('GetRoomArrowData', function(arrowData) {
		//ctx.clearRect(-100, -100, canvas.width, canvas.height);
		updateArrows(arrowData);
	})

	socket.on('GetRoomPickupData', function(pickupData) {
		updatePickups(pickupData);
	});

	socket.on('PlayerWasKilled', function(collision) {
		//console.log(collision);
		console.log(collision.playerWhoKilled.name + " Killed " + collision.playerWhoDied.name);
		//leaderboard.addScore(collision.playerWhoKilled, collision.playerWhoDied);
	})

	socket.on('YouDied', function() {
		player.die();
		console.log('You died');
	})

	socket.on('YouKilled', function() {
		player.score++;
		console.log('You killed someone');
	})

	socket.on('AddArrowCount', function() {
			player.arrowCount++;
	})

	socket.on('Disconnected', function() {
		UI.disconnected();
	});

	gameLoop();
}

function updateThisPlayer() {
	canvasScreen.order.thisPlayer = [];
	canvasScreen.order.thisName = [];
	canvasScreen.order.thisPlayer.push(player);
	canvasScreen.order.thisName.push({
		name: player.name,
		x: player.sprite.x,
		y: player.sprite.y
	})
}

function updatePickups(pickupData) {
	var pickups = [];
	for(var i = 0; i < pickupData.length; i++) {
		var data = pickupData[i];
		var pickup = {
				sprite: new Renderer.Sprite ({
					image: Renderer.Images.arrow,
					width: 16,
					height: 16,
					isSpriteSheet: true,
					x: data.x,
					y: data.y,
					index: 0
				})
		}
		//arrow.sprite.render();
		pickups.push(pickup);
	}
	//console.log(arrows);
	canvasScreen.order.pickups = pickups;
}

function updatePlayers(playerData) {
	
	var players = [];
	var names = [];
	for(var i = 0; i < playerData.length; i++) {
		var data = playerData[i];
		if(data.sprite == undefined) { break; }
		var player =  new Logic.character({
			name: data.name,
			id: data.id,
			isInThisRoom: data.isInThisRoom,
			characterIndex: data.characterIndex,
			camera: new Renderer.Camera({
				enabled: data.camera.enabled
			}),
			sprite: new Renderer.Sprite({
				image: Renderer.Images.players[data.characterIndex],
				width: data.sprite.width,
				height: data.sprite.height,
				isSpriteSheet: true,
				x: data.sprite.x,
				y: data.sprite.y,
        angle: data.sprite.angle,
				index: data.sprite.index
			}),
			speed: 2,
			minSpeed: 2,
			maxSpeed: 2.5,
			stamina: 100,
			score: data.score
		});

		//player.sprite.render();
		if(data.id != globalClientId) {
			players.push(player);
			names.push({
				name: data.name,
				x: data.sprite.x,
				y: data.sprite.y
			});
		}
	}
	canvasScreen.order.names = names;
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
        angle: data.angle,
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
	//console.log(arrows);
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
			updateThisPlayer();
			player.camera.calculatePostition(player.sprite.x, player.sprite.y); //sets camera to the position passed in here
			canvasScreen.renderInOrder();
			//socket.emit('SendArrowData', data);	
			socket.emit('SendPlayerData', data); 		// Send current client's data to everyone, so they can update
			//socket.emit('SendPickupData', data);
			lastLoopRun = new Date().getTime();
		}
	}

	setTimeout('gameLoop();', 1000 / 60);
}

setInterval(function() {
	if(globalRoomId) {
		leaderboard.update();
		//socket.emit('CheckCollision', globalRoomId);
	}
}, 1000 / 10);
