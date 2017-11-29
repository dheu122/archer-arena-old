var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
var animTimer = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false;

var mapWidth = 1280;
var mapHeight = 1280;

var Renderer = {

    // Images from our assets folder will go here
    Images: {
        map1: 'assets/maps/tileset_map1.png',
        players: ['assets/players/player_blue.png',
                  'assets/players/player_black.png',
                  'assets/players/player_green.png',
                  'assets/players/player_pink.png',
                  'assets/players/player_purple.png',
                  'assets/players/player_red.png'],
        arrow: 'assets/arrow_sprite.png',
    },

    Screen: function() {

        this.order = {
            layer1: [
                {
                    sprite: new Renderer.Sprite({
                        image: '../../assets/maps/large_layer1.png',
                        width: 1280,
                        height: 1280,
                        isSpriteSheet: false,
                        x: 0,
                        y: 0
                    })
                }
            ],
			//layer1

            layer2: [
                {
                    sprite: new Renderer.Sprite({
                        image: '../../assets/maps/large_layer2.png',
                        width: 1280,
                        height: 1280,
                        isSpriteSheet: false,
                        x: 0,
                        y: 0
                    })
                }
            ],
            pickups: [],
			players: [],
            thisPlayer: [],
            arrows: [],
			names: [],
            thisName: [],

			layer3: [
                {
                    sprite: new Renderer.Sprite({
                        image: '../../assets/maps/large_layer3.png',
                        width: 1280,
                        height: 1280,
                        isSpriteSheet: false,
                        x: 0,
                        y: 0
                    })
                }
            ]
            //layer3
        }

        this.renderInOrder = function() {
            ctx.clearRect(-100, -100, canvas.width, canvas.height);
            for(var key in this.order) {
                if(this.order.hasOwnProperty(key)) {
                    for(var i = 0; i < this.order[key].length; i++) {
                        if(key == 'names' || key == 'thisName') {
                            ctx.font = '4pt Calibri';
                            ctx.fillStyle = 'white';
                            ctx.fillText(this.order[key][i].name, this.order[key][i].x, this.order[key][i].y);
                        } else {
                            this.order[key][i].sprite.render();
                        }
                    }
                }
            }
        }
    },

    Camera: function(options) {
        this.enabled = options.enabled;
        this.x;
        this.y;

        this.isClamped = {
            x: 0,
            y: 0
        }

        this.initialize = function() {
          //initialize camera position to player
          //last two variables are the postion initilaization
          //0,0 is the top left corner of the map
          ctx.setTransform(5, 0, 0, 5, 0, 0);
        }
        //updates game of camera positioning
        this.update = function() {
            this.draw();
        }


        this.draw = function(){
        //Stamina Bar________________________
          //bar background
          ctx.fillStyle = 'rgba(190,190,190,0.75)';
          ctx.fillRect((-this.x/5) + (canvas.width/100)/2, (-this.y/5) + (canvas.height/100) * 17.5, canvas.width/25, canvas.height/75);

          //bar fill
          ctx.fillStyle = 'green';
          ctx.fillRect((-this.x/5) + (canvas.width/100)/2, (-this.y/5) + (canvas.height/100) * 17.5, ((player.curStamina/2)+1), canvas.height/75);

          //bar border
          ctx.strokeStyle = 'gold';
          ctx.strokeRect((-this.x/5) + (canvas.width/100)/2, (-this.y/5) + (canvas.height/100) * 17.5, canvas.width/25, canvas.height/75);

          //Label
          ctx.font = '9px calibri';
          ctx.fillStyle = 'black';
          ctx.fillText('Stamina',(-this.x/5) + ((canvas.width/100)/2) + 2, (-this.y/5) + (canvas.height/100) * 18.6)
        //___________________________________
        }


        //calulate position of camera
        //bounding to the edges of the map being implemented
        this.calculatePostition = function(x,y) {
            if(!this.enabled) {
                return;
            }
          //height and width buffer calculate the distance between the player and the edge of the canvas
          var widthBuffer = ((canvas.width/5)/2);
          var heightBuffer = ((canvas.height/5)/2);
          var xMin = widthBuffer - 1;
          var xMax = mapWidth - widthBuffer - 2;
          var yMin = heightBuffer - 1;
          var yMax = mapHeight - heightBuffer - 2;

          //clamps the camera position (value) to the minimum and maximum values passed in
          this.clamp = function(value, min, max){
            if(value > min && value < max) return value;
            else if(value < min) return min;
            else if(value > max) return max;
          }

          this.setIsClamped = function(x, xMin, xMax, y, yMin, yMax) {
            if(x > xMin && x < xMax)
                this.isClamped.x = 0;   // Is not clamped
            else if(x < xMin)
                this.isClamped.x = 1;   // Is at left
            else if(x > xMax)
                this.isClamped.x = 2;   // Is at right

            if(y > yMin && y < yMax)
                this.isClamped.y = 0;   // Is not clamped
            else if(y < yMin)
                this.isClamped.y = 1;   // Is at top
            else if(y > yMax)
                this.isClamped.y = 2;   // Is at bottom
          }

            //sets position of camera to passed in values (clamp returns the correct value to pass in);
            this.setIsClamped(x, xMin, xMax, y, yMin, yMax);
            this.setPosition(this.clamp(x, xMin, xMax),this.clamp(y, yMin, yMax));
        }

        //translates canvas based on new player position of canvas to passed in position
        this.setPosition = function(x, y) {
          //need to multiply x and y values by 5 due to setTransform scaling of 5
          ctx.setTransform(5,0,0,5,((-x * 5) + canvas.width/2) - 8,((-y * 5) + canvas.height/2)- 8);
          this.x = ((-x * 5) + canvas.width/2) - 8;
          this.y = ((-y * 5) + canvas.height/2)- 8;

        }
    },

    // Sprite, Tilemaps, and Animation function objects will go here
    Sprite: function(options) {
        var context = ctx;

        this.image = new Image();
        this.image.src = options.image;
        this.x = options.x;
        this.y = options.y;
        this.angle = options.angle;
        this.isSpriteSheet = options.isSpriteSheet;
        this.width = options.width;
        this.height = options.height;
        this.index = options.index;

        if(this.x == null) { this.x = 0; }
        if(this.y == null) { this.y = 0; }

        this.render = function() {
            if(this.image == null) { console.log("Image parameter is missing from render()"); return;}
            if(this.isSpriteSheet) {
                if(this.width != null && this.height != null && this.index != null) {
                    var imgWidth = this.image.width;
                    var imgHeight = this.image.height;
                    var xTiles = imgWidth / this.width;
                    var yTiles = imgHeight / this.height;

                    var curTile = 0;
                    for(var row = 0; row < yTiles; row++) {
                        for(var col = 0; col < xTiles; col++) {
                            if(this.index == curTile) {
                              if(this.angle != null) {
                                context.translate(this.x + this.width/2, this.y + this.height/2);
                                ctx.rotate(this.angle);
                                context.translate(-(this.x + this.width/2), -(this.y + this.height/2));
                                context.drawImage(this.image, col * this.width, row * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
                                context.translate(this.x + this.width/2, this.y + this.height/2);
                                ctx.rotate(-this.angle);
                                context.translate(-(this.x + this.width/2), -(this.y + this.height/2));
                                return;
                              }
                              else{
                                context.drawImage(this.image, col * this.width, row * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
                                return;
                              }
                            }
                            else {
                                curTile++;
                            }
                        }
                    }
                }
                else {
                    console.log("Width, height, or index parameter is missing from render()");
                }
            }
            else {
                context.drawImage(this.image, this.x, this.y);
            }
        }

        this.animate = function(startIndex, endIndex, animateSpeed, animateType) {
            if(!this.isSpriteSheet) {
                console.log("You cannot animate a single sprite, set isSpriteSheet to true");
            }
            else {
                var i = this.index;
                if(i < startIndex || i > endIndex) i = startIndex - 1; //smoothes out transition between animation changes
                if(animTimer > animateSpeed) {
                    if(startIndex < endIndex) {
                        if(i < endIndex) {
                            i++;
                            this.setIndex(i);
                        }
                        else {
                            if(animateType == 'pingpong') {
                                var temp = startIndex;
                                startIndex = endIndex;
                                endIndex = temp;
                                i--;
                                this.setIndex(i);
                            }
                            else if (animateType == 'loop') {
                                i = startIndex;
                                this.setIndex(i);
                            }
                        }
                    }
                    else if (startIndex > endIndex) {
                        if(i > endIndex) {
                            i--;
                            this.setIndex(i);
                        }
                        else {
                            if(animateType == 'pingpong') {
                                var temp = startIndex;
                                startIndex = endIndex;
                                endIndex = temp;
                                i++;
                                this.setIndex(i);
                            }
                            else if (animateType == 'loop') {
                                i = startIndex;
                                this.setIndex(i);
                            }
                        }
                    }
                    animTimer = 0;
                }
            }
        },

        this.setIndex = function(i) {
            this.index = i;
        }
    },

    Tilemap: function(options) {

    },
}

window.addEventListener('resize', function () {
    if(canvas.width != window.innerWidth) {
        canvas.width = window.innerWidth;
    }
    if(canvas.height != window.innerHeight) {
        canvas.height = window.innerHeight;
    }
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(5, 0, 0, 5, 0, 0);
})

setInterval(function() {
    animTimer++;
}, 1000 / 60)

// Manual browser testing functions will go here

//Ideas to implement
//
//  -Cached Rendering
//  -Title Screen
//  -Enterable rooms rendering
//  -Camera Controls
