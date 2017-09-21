/*
function move(whatCharacter) {
        if(rightPressed){
            whatCharacter.charX += 7;         
        }
        if(leftPressed){
            whatCharacter.charX -= 7;
        }
        if(upPressed){
            whatCharacter.charY -= 7;
        }
        if(downPressed){
            whatCharacter.charY += 7;
        }
}
*/


var Logic = {
    
    // Character movement, collision, attacking, and dodging mechanics function objects will go here
    rightPressed: false,
    leftPressed: false,
    upPressed: false,
    downPressed: false, 

    //stamina: 100,

    keyDownHandler: function(e) {
        if(e.keyCode == Controls.rightKey) {
            rightPressed = true;
        }
        if(e.keyCode == Controls.leftKey) {
            leftPressed = true;
        }
        if(e.keyCode == Controls.upKey) {
            upPressed = true;
        }
        if(e.keyCode == Controls.downKey) {
            downPressed = true;
        }
    },
    keyUpHandler: function(e) {
        if(e.keyCode == Controls.rightKey) {
            rightPressed = false;
        }
        if(e.keyCode == Controls.leftKey) {
            leftPressed = false;
        }
        if(e.keyCode == Controls.upKey) {
            upPressed = false;
        }
        if(e.keyCode == Controls.downKey) {
            downPressed = false;
        }
    }
 
}
  

// Manual browser testing functions will go here
document.addEventListener("keydown", Logic.keyDownHandler, false);
document.addEventListener("keyup", Logic.keyUpHandler, false);

//document.addEventListener("move", move, false);
//document.addEventListener("mousemove", mouseMoveHandler, false);