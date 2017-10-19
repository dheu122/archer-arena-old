var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");

var mapHeight = 620;
var mapWidth = 619;

var Logic = {

    // Character movement, collision, attacking, and dodging mechanics function objects will go here
    rightPressed: false,
    leftPressed: false,
    upPressed: false,
    downPressed: false,
    mousePressed: false,
    spacePressed: false,
    shiftPressed: false,

    /*TO DO:
    shoot
    collision
    game over
    score
    */

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
            this.move();
            this.sprint();
            this.dodge();
            this.bound();
            this.camera();
        }
        this.move = function() {
            //moves the player
            if(Logic.rightPressed) { //move right
                this.sprite.x += this.speed;
                this.sprite.setIndex(0);
            }
            if(Logic.leftPressed) { //move left
                this.sprite.x -= this.speed;
                this.sprite.setIndex(27);
            }
            if(Logic.upPressed) { //move up
                this.sprite.y -= this.speed;
                this.sprite.setIndex(4);
            }
            if(Logic.downPressed) { //move down
                this.sprite.y += this.speed;
                this.sprite.setIndex(5);
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
                    this.speed += 0.01;
                    this.curStamina = i;
                    i--;
                        }
                    }
                }
                //otherwise recharge stamina to max 100
            else if(Logic.shiftPressed == false && Logic.spacePressed == false && this.curStamina <= this.maxStamina) { //BUG: cannot move until stamina = 100
                var i = this.curStamina;
                this.speed = this.minSpeed;
                while (i <= this.maxStamina) {
                    i++; //make this stamina charge slower
                    this.curStamina = i;
                }
            }
        }
        this.dodge = function(){
            //instantly moves the player further
            if (Logic.spacePressed) {
                if (this.canDodge == true && this.curStamina >= 50) { //press space to dodge/dash
                    this.speed += 10;
                    this.curStamina -= 50; //drain 50 stamina
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
            //bound camera
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
        this.camera = function() {
            //camera follows player
            if(canvasPosition.x != this.sprite.x) { //x axis
                if(Logic.rightPressed) {
                    ctx.translate(-this.speed, 0); //move camera right with player
                }
                if(Logic.leftPressed) {
                    ctx.translate(this.speed, 0); //move camera left with player
                }
            }
            if(canvasPosition.y != this.sprite.y) { //y axis
                if(Logic.upPressed) {
                    ctx.translate(0, this.speed); //move camera up with player
                }
                if(Logic.downPressed) {
                    ctx.translate(0, -this.speed); //move camera down with player
                }
            }
        }
    },
    arrow: function(options) {
        this.sprite = options.sprite;
        
        this.arrowSpeed = options.arrowSpeed;   
        this.direction = options.direction;
        
        this.belongsTo = ''; //which player the arrow belongs to
        this.isInThisRoom = ''; //which room the arrow is in

        this.update = function() {
            this.createArrow();
        }
        
        this.createArrow = function (mousePosX, mousePosY, playerPosX, playerPosY) {
            //creates arrow to shoot
            if(Logic.mousePressed) {
                    var mousePosX;
                    var mousePosY; 

                    var direction;
                    var deltaX;
                    var deltaY;
                    var targetX;
                    var targetY;
                    
                    //calculate direction to shoot arrow
                    this.deltaX = this.mousePosX - this.playerPosX;
                    this.deltaY = this.mousePosY - this.playerPosY;
                    this.direction = Math.atan2(this.deltaY, this.deltaX);
                    this.targetX = Math.cos(this.direction);
                    this.targetY = Math.sin(this.direction);
                    
                    var timestamp = new Date().getUTCMilliseconds(); //time in milliseconds
                    var idString = Math.random().toString(36).substring(7); //random 5 letter string
                    
                //create initial arrow
                var arrow =  new Logic.arrow({
                    id: 'arrow-' + idString + timestamp, // gives the arrow a random ID (EXAMPLE ID: arrow-cabde716)
                    belongsTo: globalClientId,
                    isInThisRoom: globalRoomId,
                    direction: direction,
                    sprite: new Renderer.Sprite({
                    image: Renderer.Images.arrow,
                    width: 5,
                    height: 16,
                    isSpriteSheet: true,
                    x: playerPosX,  // set initial position of arrow to player position
                    y: playerPosY,
                    index: 0
                  }),
                  arrowSpeed: 3,
                });
                
                socket.emit('AddArrowData', arrow); //send arrow objectto server
            }
        }
    },
    leaderboard: function(options) {
        this.playerList = [];
        this.playerName = '';
        this.playerId = '';
        this.score = 0;
        this.rank = 0;
        this.isFirst = ''; //check if player is first place
        this.isHit = ''; //check if player is hit by arrow
        
        this.update = function() {
          this.addPlayer();
          //this.addScore();
          this.sortRank();
        }
        this.addPlayer = function(player) {
            //update leaderboard with playerList array when player joins or leaves
            this.playerList.push({
                playerName: player.name,
                playerId: player.id,
                score: 0,
                rank: 0
            });
        }
        /*this.addScore = function () {
            //calculate and add player score
            //socket.emit('AddScore', amount)
            //bonus points for hitting top player -- steal top player score
        }*/
        this.sortRank = function () {
            //calculate and change player ranking with quick sort
            var i = playerList[0]; //left
            var j = playerList.length; //right
            var pivot = playerList[Math.floor((j + i) / 2)],

            while (i <= j) {
                while (playerList[i] < pivot) {
                    i++; //move right
                }
                while (playerList[j] > pivot) {
                    j--; //move left
                }
                if (i <= j) { //when i and j meet
                    swap(playerList, i, j); //perform sort
                    i++;
                    j--;
                }
            }
            return i;
        }
    },
    keyDownHandler: function(e) {
        if(e.keyCode == Controls.rightKey) { //right key pressed
            Logic.rightPressed = true;
        }
        if(e.keyCode == Controls.leftKey) {  //left key pressed
            Logic.leftPressed = true;
        }
        if(e.keyCode == Controls.upKey) { //up key pressed
            Logic.upPressed = true;
        }
        if(e.keyCode == Controls.downKey) { //down key pressed
            Logic.downPressed = true;
        }
        if (e.keyCode == Controls.spaceKey) { //spacebar pressed
            Logic.spacePressed = true;
        }
        if (e.keyCode == Controls.shiftKey){ //shift key pressed
            Logic.shiftPressed = true;
        }
    },
    keyUpHandler: function(e) {
        if(e.keyCode == Controls.rightKey) { //right key not pressed
            Logic.rightPressed = false;
        }
        if(e.keyCode == Controls.leftKey) { //left key not pressed
            Logic.leftPressed = false;
        }
        if(e.keyCode == Controls.upKey) { //up key not pressed
            Logic.upPressed = false;
        }
        if(e.keyCode == Controls.downKey) { //down key not pressed
            Logic.downPressed = false;
        }
        if (e.keyCode == Controls.spaceKey) { //spacebar not pressed
            Logic.spacePressed = false;
        }
        if (e.keyCode == Controls.shiftKey){ //shift key not pressed
            Logic.shiftPressed = false;
        }
    },
    mouseDownHandler: function(e) {
        if (e.button == Controls.leftClick) { //left click pressed
            Logic.mousePressed = true;
        }
    },
    mouseUpHandler: function(e) {
        if (e.button == Controls.leftClick) { //left click not pressed
            Logic.mousePressed = false;
        }
    },
    getMousePosition: function (e) {
        var mousePosX = e.clientX; //where mouse cursor is
        var mousePosY = e.clientY;
    },
    collision: function (object1, object2) {
        return object1.x < object2.x + object2.width &&
        object1.x + object1.width > object2.x &&
        object1.y < object2.y + object2.height &&
        object1.y + object1.height > object2.y;
    },
}


// Manual browser testing functions will go here
document.addEventListener("keydown", Logic.keyDownHandler, false); //up, down, left, right, space, shift
document.addEventListener("keyup", Logic.keyUpHandler, false);

document.addEventListener("mousedown", Logic.mouseDownHandler, false); //mouse click
document.addEventListener("mouseup", Logic.mouseUpHandler, false);

document.addEventListener("mousemove", Logic.getMousePosition, false); //mouse movement