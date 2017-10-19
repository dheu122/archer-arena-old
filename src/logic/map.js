var JsonMap = {

    mapHeight: 0,
    mapWidth: 0,
    mapTotalWidth: 0,
    mapTotalHeight: 0,
    jsonMap: null,

    render: function(json) {
        var layers = json.layers;
        JsonMap.mapHeight = json.height;
        JsonMap.mapWidth = json.width;
        JsonMap.mapTotalHeight = json.height * 16;
        JsonMap.mapTotalWidth = json.width * 16;
        this.jsonMap = json;

        for(var i = 0; i < layers.length; i++) {
            var data = layers[i];
            this.draw(data); // IF YOU UNCOMMENT THIS, THE GAME WILL CRASH ON RUN
        }
    },

    draw: function(data) {
        for(var col = 0; col < JsonMap.mapWidth; col++) {
            for(var row = 0; row < JsonMap.mapHeight; row++) {
                var tile = new Renderer.Sprite({
                    image: Renderer.Images.map1,
                    width: 16,
                    height: 16,
                    isSpriteSheet: true,
                    x: col * 16,
                    y: row * 16,
                    index: 0
                })
                // given a col and row, find the index of that tile. Starting from 0.
                //console.log(data[(row*this.mapWidth)+col]);
                switch(data.data[col+(row*this.mapWidth)]) { //this mathematical equation indexes the tile matrix to fit any width and height
                    case 50:
                        tile.setIndex(49); //grass
                        tile.render();
                        break;
					case 59:
                        tile.setIndex(58); //ice
                        tile.render();
                        break;
					case 75:
                        tile.setIndex(74); //flower1
                        tile.render();
                        break;
					case 76:
                        tile.setIndex(75); //flower2
                        tile.render();
                        break;
					case 87:
                        tile.setIndex(86); //ice
                        tile.render();
                        break;
					case 88:
                        tile.setIndex(87); //ice
                        tile.render();
                        break;
					case 97:
                        tile.setIndex(96); //2nd LAYER GRASS
                        tile.render();
                        break;
                    case 118:
                        tile.setIndex(117); //hole will be the rest of the cases
                        tile.render();
                        break;
					case 119:
                        tile.setIndex(118); //hole will be the rest of the cases
                        tile.render();
                        break;
					case 120:
                        tile.setIndex(119); //hole will be the rest of the cases
                        tile.render();
                        break;
					case 130:
                        tile.setIndex(129); //hole will be the rest of the cases
                        tile.render();
                        break;
					case 131:
                        tile.setIndex(130); //hole will be the rest of the cases
                        tile.render();
                        break;
					case 132:
                        tile.setIndex(131); //hole will be the rest of the cases
                        tile.render();
                        break;
					case 142:
                        tile.setIndex(141); //hole will be the rest of the cases
                        tile.render();
                        break;
					case 143:
                        tile.setIndex(142); //hole will be the rest of the cases
                        tile.render();
                        break;
					case 144:
                        tile.setIndex(143); //hole will be the rest of the cases
                        tile.render();
                        break;
					case 158:
                        tile.setIndex(157); //dirt
                        tile.render();
                        break;
					case 161:
                        tile.setIndex(160); //mud
                        tile.render();
                        break;
					case 164:
                        tile.setIndex(163); //sand
                        tile.render();
                        break;
                }
            }
        }
    }
}