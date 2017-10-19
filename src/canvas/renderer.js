var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
var animTimer = 0;
var canvasPosition = {
    x: 7.5,
    y: 8
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false;
ctx.setTransform(5, 0, 0, 5, ((canvas.width/2) - 64), ((canvas.height/2) - 64));
//console.log(canvasPosition);
//console.log(((canvas.width/2) - 64));
//console.log(((canvas.height/2) - 64));

var Renderer = {

    // Images from our assets folder will go here
    Images: {
      
		    map1: 'assets/tileset_map1.png',
        player: 'assets/movement_sprite.png',
        arrow: 'assets/arrow_sprite.png'

    },

    Canvas: {
        setPosition: function(x, y) {
            canvasPosition.x = x;
            canvasPosition.y = y;
        }
    },

    // Sprite, Tilemaps, and Animation function objects will go here
    Sprite: function(options) {
        var context = ctx;

        this.image = new Image();
        this.image.src = options.image;
        this.oldx;
        this.oldy;
        this.x = options.x;
        this.y = options.y;

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
                                context.drawImage(this.image, col * this.width, row * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
                                return;
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

        //TODO: get working; Currently speeds up the more you move in one direction(loop never stops)
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
    ctx.setTransform(5, 0, 0, 5, ((canvas.width/2) - 64), ((canvas.height/2) - 64));
    //console.log(canvasPosition);
    //console.log(((canvas.width/2) - 64));
    //console.log(((canvas.height/2) - 64));
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
