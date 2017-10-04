// This is the compiled game. Should be empty for now.
var socket = io();

// Example of connecting to the server, uses 'ConnectToServer' from server.js
socket.emit('ConnectToServer', {name: 'Bilbo Baggins'});

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



/////////////////////////////////////////////////


// Creates a new player 'character', and renders a sprite
var player = new Logic.character({
	sprite: new Renderer.Sprite({
		image: Renderer.Images.player,
		width: 16,
		height: 16,
		isSpriteSheet: true,
		x: 0,
		y: 0,
		index: 0
	}),
	speed: 2,
	stamina: 100
});

window.onload = function() {
	loadJSON('/assets/Forest16px', gameLoop);
	gameLoop();
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
		ctx.clearRect(0, 0, 480, 320);
		player.update();
		lastLoopRun = new Date().getTime();
	}
	
	setTimeout('gameLoop();', 2);
}