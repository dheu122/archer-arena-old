var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");


///////////////////////////////////////////////// SOUND FUNCTION
var arrowShot = new sound("assets/sounds/gunShot.wav");
var arrowHit = new sound("assets/sounds/arrowHit.wav");

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


function arrowHitSoundPlayer() {
	arrowHit.play();
}

function arrowShotSoundPlayer() {
	arrowShot.play();
}

/////////////////////////////////////////////////

var staminaTimer = 0; //for setInterval of stamina

var Logic = {

    // Character movement, collision, attacking, and dodging mechanics function objects will go here
    rightPressed: false,
    leftPressed: false,
    upPressed: false,
    downPressed: false,
    mousePressed: false,
    spacePressed: false,
    shiftPressed: false,
    canvasMousePosition: {},
    mousePositionFromPlayer: {},

    character: function(options) {
        this.name = options.name;

        this.camera = options.camera;
        this.sprite = options.sprite;

        this.speed = options.speed;
        this.maxSpeed = options.maxSpeed;
        this.minSpeed = options.minSpeed;

        this.maxStamina = 100;
        this.curStamina = this.maxStamina;

        this.isDead = options.isDead;

        this.canDodge = true;
        this.canShoot = true;

        this.curArrowTimer = 0;
        this.arrowTimer = 60;
        this.arrowCount = 1;

        this.score = 0;

        this.origin = {x: 0, y: 0},

        this.update = function() {
            if(!this.isDead) {
                this.move();
                this.sprint();
                this.dodge();
                this.bound();
                this.createArrow();
                this.setOrigin();
            }
        }
        this.move = function() {
            //face right: index0 right movement: index1,index2
            if(Logic.rightPressed) {
                this.sprite.animate(1, 2, 10, 'loop');
                this.sprite.x += this.speed;
            }
            //face left: index3 left movement: index4,index5
            if(Logic.leftPressed) {
                this.sprite.animate(4, 5, 10, 'loop');
                this.sprite.x -= this.speed;
            }
            //face up: index9 upward movement: index10,index11
            if(Logic.upPressed) {
                this.sprite.animate(10, 11, 10, 'loop');
                this.sprite.y -= this.speed;
            }
            //face down: index6 downward movement: index7,index8
            if(Logic.downPressed) {
                this.sprite.animate(7, 8, 10, 'loop');
                this.sprite.y += this.speed;
            }
        }
        this.sprint = function() {
            //sprint while draining stamina but cannot shoot
            if(Logic.shiftPressed) {
                var i = this.curStamina;
                if (i >= 0) {
                    if (this.speed > this.maxSpeed) {
                        this.speed = this.maxSpeed;
                    }
                    else {
                        Logic.mousePressed = false; //cannot shoot
                        this.speed += 0.01;
                        i--;
                        this.curStamina = i;
                    }
                } else {
                    this.speed = this.minSpeed;
                }
            }
                //otherwise recharge stamina to maximum value
            else if(Logic.shiftPressed == false && Logic.spacePressed == false && this.curStamina <= this.maxStamina) {
                var i = this.curStamina;
                this.speed = this.minSpeed;
                if (i <= this.maxStamina && staminaTimer > 1) { //staminaTimer to 1 10th of a second
                    i++;
                    this.curStamina = i;
                    staminaTimer = 0; //reinitialize staminaTimer
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
            if(this.sprite.x + this.sprite.width + (this.sprite.width/2) > mapWidth){
                this.sprite.x = mapWidth - this.sprite.width - (this.sprite.width/2);
            }
            if(this.sprite.y + this.sprite.height + (this.sprite.height/2) > mapHeight){
                this.sprite.y = mapHeight - this.sprite.height - (this.sprite.height/2);
            }
        }
        this.createArrow = function () {
            this.curArrowTimer++;
            if(this.curArrowTimer > this.arrowTimer) {
                this.canShoot = true;
                this.curArrowTimer = this.arrowTimer;
            }

            //creates arrow to shoot
			if(Logic.mousePressed && this.canShoot && this.arrowCount > 0) {
                
				//shoot sound
				arrowShotSoundPlayer();
				
				//calculate direction to shoot arrow
                var deltaX = this.origin.x;
                var deltaY = this.origin.y;

                var speed = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
                var maxSpeed = 3;

                var angle = Math.atan2(Logic.canvasMousePosition.x - (canvas.width / 2),-(Logic.canvasMousePosition.y - (canvas.height / 2))) * (180/Math.PI);

                var timestamp = new Date().getUTCMilliseconds(); //time in milliseconds
                var idString = Math.random().toString(36).substring(7); //random 5 letter string

                if(speed > maxSpeed) {
                    var speedRatio = speed / maxSpeed;
                    deltaX = deltaX / speedRatio;
                    deltaY = deltaY / speedRatio;
                }

				//create initial arrow
				var arrow =  new Logic.arrow({
                    id: 'arrow-' + idString + timestamp, // gives the arrow a random ID (EXAMPLE ID: arrow-cabde716)
                    belongsTo: globalClientId,
                    isInThisRoom: globalRoomId,
                    angle: angle,
                    lifetime: 100,
					sprite: new Renderer.Sprite({
                        image: Renderer.Images.arrow,
                        width: 16,
                        height: 16,
                        isSpriteSheet: true,
                        x: this.sprite.x,  // set initial position of arrow to player position
                        y: this.sprite.y,
                        angle: this.angle,
                        index: 0
                    }),
                    arrowSpeedX: deltaX,
				    arrowSpeedY: deltaY
				});

                socket.emit('AddArrowData', arrow); //send arrow object to server
                this.arrowCount--;
                this.canShoot = false;
                this.curArrowTimer = 0;
			}
        }
        this.setOrigin = function() {

            if(this.camera.isClamped.x == 0) {
                this.origin.x = (this.sprite.x - ((canvas.width/5)/2)) + (Logic.mousePositionFromPlayer.x - this.sprite.x) - 8;
            }
            else if(this.camera.isClamped.x == 1) {
                this.origin.x = Logic.mousePositionFromPlayer.x - this.sprite.x - 8;
            }
            else if(this.camera.isClamped.x == 2) {
                this.origin.x = (mapWidth - (canvas.width/5)) + (Logic.mousePositionFromPlayer.x - this.sprite.x) - 8;
            }

            if(this.camera.isClamped.y == 0) {
                this.origin.y = (this.sprite.y - ((canvas.height/5)/2)) + (Logic.mousePositionFromPlayer.y - this.sprite.y) - 8;
            }
            else if(this.camera.isClamped.y == 1) {
                this.origin.y = Logic.mousePositionFromPlayer.y - this.sprite.y - 8;
            }
            else if(this.camera.isClamped.y == 2) {
                this.origin.y = (mapHeight - (canvas.height/5)) + (Logic.mousePositionFromPlayer.y - this.sprite.y) - 8;
            }
        },
        this.die = function() {
            var _this = this;
            //var tempName = '';
            var timer = 5;
            var respawnTimer = setInterval(waitForRespawn, 1000);
            var respawnNote = 'You died!';

            this.camera.enabled = false;
            this.isDead = true;
            this.sprite.height = 0;
            this.sprite.width = 0;
            this.score = 0;

            //tempName = this.name;
            this.name = respawnNote;

            function waitForRespawn() {
                if(timer == 0) {
                    _this.respawn();
                    //this.name = tempName;
                    clearInterval(respawnTimer);
                } else {
                    _this.name = 'Respawning in ' + timer;
                    timer--;
                }
            }
        },
        this.respawn = function(/*tempName*/) {
            this.sprite.height = 16;
            this.sprite.width = 15;
            this.camera.enabled = true;
            this.isDead = false;
            this.arrowCount = 1;
            //this.name = tempName;

            // hard-coded the map-width/map-height. Change 1500 to mapWidth or mapHeight
            this.sprite.x = Math.floor((Math.random() * 1500) + 100);
            this.sprite.y = Math.floor((Math.random() * 1500) + 100);
        }
    },

    arrow: function(options) {
        this.sprite = options.sprite;

        this.id = options.id;

        this.arrowSpeedX = options.arrowSpeedX;
        this.arrowSpeedY = options.arrowSpeedY;
        this.angle = options.angle;

		this.belongsTo = options.belongsTo; //which player the arrow belongs to
        this.isInThisRoom = options.isInThisRoom; //which room the arrow is in

        this.lifetime = options.lifetime;
    },

    leaderboard: function(options) {
        this.playerList = [];
        this.isFirst = ''; //check if player is first place
        this.isHit = ''; //check if player is hit by arrow
        this.hit = ''; //check if player hit another player with arrow

        this.update = function() {
          //this.addPlayer();
          this.playerList = this.sortScore(this.playerList, 'score');
          //console.log(this.playerList);
        }
        this.addPlayer = function(player) { //update leaderboard with playerList array when player joins or leaves
            this.playerList.push({
                playerName: player.name,
                playerId: player.id,
                score: 0,
            });
        }
        this.sortScore = function (array, key) { //sort scores of players and ranks them on leaderboard from highest (1st) to lowest
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }
    },

    keyDownHandler: function(e) {
        if(e.keyCode == Controls.rightKey || e.keyCode == Controls.rightKey2) {
            Logic.rightPressed = true;
        }
        if(e.keyCode == Controls.leftKey || e.keyCode == Controls.leftKey2) {
            Logic.leftPressed = true;
        }
        if(e.keyCode == Controls.upKey || e.keyCode == Controls.upKey2) {
            Logic.upPressed = true;
        }
        if(e.keyCode == Controls.downKey || e.keyCode == Controls.downKey2) {
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
        if(e.keyCode == Controls.rightKey || e.keyCode == Controls.rightKey2) {
            Logic.rightPressed = false;
        }
        if(e.keyCode == Controls.leftKey || e.keyCode == Controls.leftKey2) {
            Logic.leftPressed = false;
        }
        if(e.keyCode == Controls.upKey || e.keyCode == Controls.upKey2) {
            Logic.upPressed = false;
        }
        if(e.keyCode == Controls.downKey || e.keyCode == Controls.downKey2) {
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
            Logic.mousePressed = true;
        }
    },
    mouseUpHandler: function(e) {
        if (e.button == Controls.leftClick) {
            Logic.mousePressed = false;
        }
    },
    getMousePosition: function (e) {
        var mouseX = e.clientX - ctx.canvas.offsetLeft;
        var mouseY = e.clientY - ctx.canvas.offsetTop;

        var canvasMousePos = {
            x: e.clientX,
            y: e.clientY
        }

        var mousePositionFromPlayer = {
            x: (mouseX * (canvas.width/5) / canvas.clientWidth),
            y: (mouseY * (canvas.height/5) / canvas.clientHeight)
        }

        Logic.mousePositionFromPlayer = mousePositionFromPlayer;
        Logic.canvasMousePosition = canvasMousePos;
    },
    collision: function (object1, object2) {
        if (object1.x < object2.x + object2.width &&
        object1.x + object1.width > object2.x &&
        object1.y < object2.y + object2.height &&
        object1.y + object1.height > object2.y) {
            canCollide = true;
        }
        else {
            canCollide = false;
        }
    },
}


// Manual browser testing functions will go here
document.addEventListener("keydown", Logic.keyDownHandler, false); //up, down, left, right, space, shift
document.addEventListener("keyup", Logic.keyUpHandler, false);

document.addEventListener("mousedown", Logic.mouseDownHandler, false); //mouse click
document.addEventListener("mouseup", Logic.mouseUpHandler, false);
document.addEventListener("mousemove", Logic.getMousePosition, false); //mouse movement

setInterval(function(){
    staminaTimer++; //increment the stamina
}, 1000/20); //20 times per 1 second (1000 is in milliseconds)
