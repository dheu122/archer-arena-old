// This is the compiled game. Should be empty for now.
var socket = io();

// Global room id when joining, this will help tell the client which room and
// which players it will associate with
var globalRoomId;

/////////////////////////////////////////////////


function loadJSON(url, onsuccess) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if ((request.readyState == 4) && (request.status == 200)) // if DONE and SUCCESS
      onsuccess(JSON.parse(request.responseText));
  }
  console.log(request);
  request.open("GET", url + ".json", true);
  request.send();
}



///////////////////////////////////////////////// SOUND FUNCTION
var titleMusic;
var gameMusic = new sound("assets/BackgroundMusic.wav");

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

function musicPlayer() {
    //gameMusic.play();
}

musicPlayer();

function donePlaying() {

	if (gameMusic.paused = true) {
		musicPlayer();
	}

}

/////////////////////////////////////////////////

// Creates a new player 'character', and renders a sprite
var player = new Logic.character({
	name: '',
	id: '',
	isInThisRoom: '',
	sprite: new Renderer.Sprite({
		image: Renderer.Images.player,
		width: 15,
		height: 16,
		isSpriteSheet: true,
		x: 0,
		y: 0,
		index: 0
	}),
	speed: 2,
	minSpeed: 2,
	maxSpeed: 2.5,
	stamina: 100
});

// Map for debugging, remove later
var debugMap = new Renderer.Sprite({
	image: '../../assets/map_debug.png',
	width: 619,
	height: 620,
	isSpriteSheet: false,
	x: 0,
	y: 0
})

window.onload = function() {
	loadJSON('/assets/Forest16px', gameLoop);

	socket.on('JoinedRoom', function(identity) {
		globalRoomId = identity.roomId;
		player.isInThisRoom = identity.roomId;
		player.id = identity.id;
	});

	socket.on('GetRoomPlayerData', function(playerData) {
		//console.log(playerData);
		ctx.clearRect(0, 0, 480, 320);
		updatePlayers(playerData);
	});

	Renderer.Canvas.setPosition(0, 0); // Set to randomly located position from server
	gameLoop();
}

function updatePlayers(playerData) {
	debugMap.render();
	for(var i = 0; i < playerData.length; i++) {
		var data = playerData[i];
		var player =  new Logic.character({
			name: '',
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
			stamina: 100
		});
		player.sprite.render();
	}
}
// Clears the screen
// Calls the player's update() function and redraws itself
// Repeat
var lastLoopRun = 0;
function gameLoop() { //this is the main game loop, i found a version of it in a tutorial, basically repeats every 2 miliseconds and runs at 33 fps 1000ms/30 = 33.3
	if (new Date().getTime() - lastLoopRun > 15) {
		//updatePositions();
		//handleControls();
		//showSprites();
		donePlaying();
		if(globalRoomId) {
			var data = {
				playerData: player,
				roomId: globalRoomId
			}

			player.update();					// Updates current client to itself
			Renderer.Canvas.setPosition(player.sprite.x, player.sprite.y);
			socket.emit('SendPlayerData', data); 		// Send current client's data to everyone, so they can update
			lastLoopRun = new Date().getTime();
		}
	}

	setTimeout('gameLoop();', 2);
}
