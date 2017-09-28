var Logic = {
    
    // Character movement, collision, attacking, and dodging mechanics function objects will go here
    rightPressed: false,
    leftPressed: false,
    upPressed: false,
    downPressed: false, 
    mousePressed: false,

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
            this.move();
        }
        this.move = function() {
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
    },
    mouseDownHandler: function(e) {
        if (e.button == Controls.leftClick) {
            mousePressed = true;
        }
    },
    mouseUpHandler: function(e) {
        if (e.button == Controls.leftClick) {
            mousePressed = false;
        }
    },
    getMousePosition: function (e) {
        var mousePosX = e.clientX;
        var mousePosY = e.clientY;
        console.log('mousePos: ' + mousePosX + ',' + mousePosY); //remove after testing
    },

}
  

// Manual browser testing functions will go here
document.addEventListener("keydown", Logic.keyDownHandler, false);
document.addEventListener("keyup", Logic.keyUpHandler, false);

document.addEventListener("mousedown", Logic.mouseDownHandler, false);
document.addEventListener("mouseup", Logic.mouseUpHandler, false);

document.addEventListener("mousemove", Logic.getMousePosition, false);

//document.addEventListener("spritemove", Logic.move, false);