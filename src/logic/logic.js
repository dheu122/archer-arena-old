var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 320;

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
        this.minSpeed = options.minSpeed;

        this.maxStamina = 100;
        this.curStamina = this.maxStamina;

        this.canDodge = true;
        this.arrowCount = 0;
        this.update = function() {
            //this.sprite.render();
            this.move();
            this.sprint();
            this.dodge();
            this.bound();
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
                this.sprite.setIndex(0);
                // while(Logic.rightPressed) this.sprite.animate(1,2,10,'loop');
            }
            if(Logic.leftPressed) {
                this.sprite.x -= this.speed;
                this.sprite.setIndex(27);
                // while(Logic.upPressed) this.animate();
            }
            if(Logic.upPressed) {
                this.sprite.y -= this.speed;
                this.sprite.setIndex(4);
                // while(Logic.upPressed) this.animate();
            }
            if(Logic.downPressed) {
                this.sprite.y += this.speed;
                this.sprite.setIndex(5);
                // while(Logic.upPressed) this.animate();
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
                    Logic.mousePressed = false; //may be buggy
                    this.speed += 0.01;
                    this.curStamina = i;
                    i--;
                        }
                    }
                }
                //otherwise recharge stamina to max 100
            else if(Logic.shiftPressed == false && Logic.spacePressed == false && this.curStamina <= this.maxStamina) { //BUG: cannot move until stamina = 100
                var i = this.curStamina;
                this.speed = this.minSpeed; //make this decelerate?
                while (i <= this.maxStamina) {
                    i++; //make this slower
                    this.curStamina = i;
                }
            }
        }
        this.dodge = function(){ //BUG: should not be able to hold down space; make instant press
            if (Logic.spacePressed) {
                if (this.canDodge == true && this.curStamina >= 50) {
                    this.speed += 10;
                    this.curStamina -= 50;
                    this.canDodge = false;
                }
                else {
                    this.speed = this.minSpeed;
                }
            }
            else {
                this.canDodge = true;
            }
        }
        this.bound = function() {
            if(this.sprite.x - this.sprite.width/2 < 0){
                this.sprite.x = this.sprite.width/2;
            }
            if(this.sprite.y - this.sprite.height/2 < 0){
                this.sprite.y = this.sprite.height/2;
            }
            if(this.sprite.x + this.sprite.width + (this.sprite.width/2) > canvas.width){
                this.sprite.x = canvas.width - this.sprite.width - (this.sprite.width/2);
            }
            if(this.sprite.y + this.sprite.height + (this.sprite.height/2) > canvas.height){
                this.sprite.y = canvas.height - this.sprite.height - (this.sprite.height/2);
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
        }
        if (e.keyCode == Controls.shiftKey){
            Logic.shiftPressed = true;
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
    },
}


// Manual browser testing functions will go here
document.addEventListener("keydown", Logic.keyDownHandler, false); //up, down, left, right, space, shift
document.addEventListener("keyup", Logic.keyUpHandler, false);

document.addEventListener("mousedown", Logic.mouseDownHandler, false); //mouse click
document.addEventListener("mouseup", Logic.mouseUpHandler, false);

document.addEventListener("mousemove", Logic.getMousePosition, false); //mouse movement

//document.addEventListener("spritemove", Logic.move, false);
