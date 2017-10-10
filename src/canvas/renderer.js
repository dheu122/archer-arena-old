var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;
ctx.scale(3,3);

var Renderer = {
    // Images from our assets folder will go here
    Images: {
        player: 'assets/sprite_sheet.png'
    },

    // Sprite, Tilemaps, and Animation function objects will go here
    Sprite: function(options) {
        var context = ctx;

        this.image = new Image();
        this.image.src = options.image;

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
                var _this = this;
                var i = startIndex;
                setInterval(function() {
                    context.clearRect(_this.x, _this.y, _this.width, _this.height);
                    if(startIndex < endIndex) {
                        if(i < endIndex) {
                            i++;
                            _this.setIndex(i);
                        }
                        else {
                            if(animateType == 'pingpong') {
                                var temp = startIndex;
                                startIndex = endIndex;
                                endIndex = temp;
                                i--;
                                _this.setIndex(i);
                            }
                            else if (animateType == 'loop') {
                                i = startIndex;
                                _this.setIndex(i);
                            }
                        }
                    }
                    else if (startIndex > endIndex) {
                        if(i > endIndex) {
                            i--;
                            _this.setIndex(i);
                        }
                        else {
                            if(animateType == 'pingpong') {
                                var temp = startIndex;
                                startIndex = endIndex;
                                endIndex = temp;
                                i++;
                                _this.setIndex(i);
                            }
                            else if (animateType == 'loop') {
                                i = startIndex;
                                _this.setIndex(i);
                            }
                        }
                    }
                    _this.render();
                }, 1000 / animateSpeed);
            }
        }

        this.setIndex = function(i) {
            this.index = i;
            this.render();
        }
    },

    Tilemap: function(options) {

    }
}

// Manual browser testing functions will go here

//Ideas to implement
//
//  -Cached Rendering
//  -Title Screen
//  -Enterable rooms rendering
//  -Camera Controls
