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

    character: function(options) {
        this.sprite = options.sprite;

        this.speed = options.speed;

        this.curStamina = 0;
        this.maxStamina = options.stamina;
        
        this.canDodge = 0
        this.arrowCount = 0;

        this.update = function() {
            this.sprite.render();
            if(Logic.rightPressed) {
                //this.sprite.animate(0, 3, 10, 'loop');
                this.sprite.x += this.speed;
            }
            if(Logic.leftPressed) {
                this.sprite.x -= this.speed;
            }
            if(Logic.upPressed) {
                this.sprite.y -= this.speed;
            }
            if(Logic.downPressed) {
                this.sprite.y += this.speed;
            }
        }
    },

    keyDownHandler: function(e) {
        if(e.keyCode == Controls.rightKey) {
            Logic.rightPressed = true;
        }
        if(e.keyCode == Controls.leftKey) {
            Logic.leftPressed = true;
        }
        if(e.keyCode == Controls.upKey) {
            Logic.upPressed = true;
        }
        if(e.keyCode == Controls.downKey) {
            Logic.downPressed = true;
        }
    },
    keyUpHandler: function(e) {
        if(e.keyCode == Controls.rightKey) {
            Logic.rightPressed = false;
        }
        if(e.keyCode == Controls.leftKey) {
            Logic.leftPressed = false;
        }
        if(e.keyCode == Controls.upKey) {
            Logic.upPressed = false;
        }
        if(e.keyCode == Controls.downKey) {
            Logic.downPressed = false;
        }
    }
 
}
  

// Manual browser testing functions will go here
document.addEventListener("keydown", Logic.keyDownHandler, false);
document.addEventListener("keyup", Logic.keyUpHandler, false);

//document.addEventListener("move", move, false);
//document.addEventListener("mousemove", mouseMoveHandler, false);