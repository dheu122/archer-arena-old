var Map = {

    render: function(json) {
        var layers = json.layers;

        for(var i = 0; i < layers.length; i++) {
            var data = layers[i];

        }
    },

    draw: function(data) {
        for(var i = 0; i < data.length; i++) {
            switch(data[i]) {
                case 50:
                    // draw grass;
                    break;
                case 158:
                    // draw dirt;
                    break;
            }
        }
    }

}