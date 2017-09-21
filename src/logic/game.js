// This is the compiled game. Should be empty for now.

function gameLoop() { //this is the main game loop, i found a version of it in a tutorial, basically repeats every 2 miliseconds and runs at 33 fps 1000ms/30 = 33.3
	if (new Date().getTime() - lastLoopRun > 30) {
	//updatePositions();
	//handleControls();
	//showSprites();
	lastLoopRun = new Date().getTime();
	}
	setTimeout('gameLoop();', 2);
}