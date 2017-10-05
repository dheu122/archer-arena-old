var Logic = {
    
    // Character movement, collision, attacking, and dodging mechanics function objects will go here
    rightPressed: false,
    leftPressed: false,
    upPressed: false,
    downPressed: false, 
    mousePressed: false,
    spacePressed: false,
    shiftPressed: false,

    character: function(options) {
        this.sprite = options.sprite;

        this.speed = options.speed;
        this.maxSpeed = options.maxSpeed;
        
        this.maxStamina = 100;
        this.curStamina = this.maxStamina;
        
        this.canDodge = 0
        this.arrowCount = 0;
        this.update = function() {
            this.sprite.render();
            this.move();
            this.sprint();
        }
        /*this.firearrow function(){
            var arrowX = charPosX + 10;
            var arrowY = charPosY + 10;
            if (mousePressed == true) {
                this.sprite.x = arrowX;
                this.sprite.y = arrowY;
                render(arrow, mousePosX, mousePosY);

                this.arrow = arrowSpeed;

                if (this.arrow > canvas.edge || this.arrow > sprite.edge) {
                    mousePressed = false;
                    break;
                }
            }
        }*/
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
        this.sprint = function() {
            //sprint while draining stamina but cannot shoot
            if(Logic.shiftPressed) {
                var i = this.curStamina;
                while (i >= 0) {
                    if (this.speed > this.maxSpeed) {
                        this.speed = this.maxSpeed;
                    }
                    else {
                    Logic.mousePressed = false;
                    this.speed = this.speed + 0.1;
                    this.curStamina = i;
                    console.log('SPRINT i: ' + i);
                    i--;
                        }
                    }
                }
                //otherwise recharge stamina to max 100
                else if(Logic.shiftPressed = false && this.curStamina <= this.maxStamina) { //BUG: does not execute loop
                    //var i = this.curStamina;
                    while (i <= this.maxStamina) {
                        console.log('RECHARGE i: ' + i);
                        i++;
                    }
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
        if (e.keyCode == Controls.spaceKey) {
            Logic.spacePressed = true;
            console.log('spaceTRUE')
        }
        if (e.keyCode == Controls.shiftKey){
            Logic.shiftPressed = true;
            console.log('shiftTRUE')
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
        if (e.keyCode == Controls.spaceKey) {
            Logic.spacePressed = false;
        }
        if (e.keyCode == Controls.shiftKey){
            Logic.shiftPressed = false;
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
        //console.log('mousePos: ' + mousePosX + ',' + mousePosY); //remove after testing
    },
    boundSprite: function (sprite) {
        if (sprite.x < 20) {
            sprite.x = 20;
        }
        if (sprite.y < 20) {
            sprite.y = 20;
        }
        if (sprite.x + sprite.width > 480) {
            sprite.x = 480 - sprite.width;
        }
        if (sprite.y + sprite.height > 480) {
            sprite.y = 480 - sprite.height;
        }
    },
}
  

// Manual browser testing functions will go here
document.addEventListener("keydown", Logic.keyDownHandler, false); //up, down, left, right, space, shift
document.addEventListener("keyup", Logic.keyUpHandler, false);

document.addEventListener("mousedown", Logic.mouseDownHandler, false); //mouse click
document.addEventListener("mouseup", Logic.mouseUpHandler, false);

document.addEventListener("mousemove", Logic.getMousePosition, false); //mouse movement

//document.addEventListener("spritemove", Logic.move, false);
