var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socket(server);

var arrows = [];

/*
    Informal Arrow Interface {
        id: 'arrow-' + idString + timestamp,
        belongsTo: globalClientId,
        isInThisRoom: globalRoomId,
        angle: angle,
        sprite: new Renderer.Sprite({
            image: Renderer.Images.arrow,
            width: 5,
            height: 16,
            isSpriteSheet: true,
            x: playerPosX,
            y: playerPosY,
            index: 0
        }),
        arrowSpeed: 3,
    }
*/

module.exports = {

    getArrows: function() {
        return arrows;
    },

    getArrowIndexById: function(id) {
        for(var i = 0; i < arrows.length; i++) {
            if(arrows[i].id == id) {
                return i;
            }
        }
    },

    deleteArrowAt: function(index) {
        arrows.splice(index, 1);
    },

    addArrowToServer: function(arrowData, socketId, roomId) {
        arrows.push(arrowData);
    },

    updateAllArrowsInRoom: function(arrowsInRoom) {
        var updatedArrows = [];
        // Update arrow here,
        // Update lifetime here
        if(!arrowsInRoom) {
            return;
        }

        for(var i = 0; i < arrowsInRoom.length; i++) {
            for(var j = 0; j < arrows.length; j++) {
                if(arrowsInRoom[i].id == arrows[j].id) {
                    // Is the arrow we are looking for.
                    var arrow = arrows[j];
                    arrow.lifetime--;
                    if(arrow.lifetime <= 0) {
                        this.deleteArrowAt(j);
                    } else {
                        arrow.sprite.x += arrow.arrowSpeedX;
                        arrow.sprite.y += arrow.arrowSpeedY;
                        arrows[j] = arrow;
                        updatedArrows.push(arrow);
                    }
                }
            }
        }

        return updatedArrows;
    }

}