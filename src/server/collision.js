var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socket(server);

var room = require('./room');

// FIXME: Need to delete players correctly
module.exports = {
    returnCollided: function(roomId, players, arrows) {
        var playerIdsInRoom = room.getPlayersInRoom(roomId);
        //var arrowIdsInRoom = room.getArrowsInRoom(roomId);
        var arrowsInRoom = room.getArrowsInRoom(roomId);
        
        var playersInRoom = [];

        // This is EXTREMELY unefficient

        if(playerIdsInRoom == undefined) { return; }

        for(var i = 0; i < playerIdsInRoom.length; i++) {
            for(var j = 0; j < players.length; j++) {
                if(playerIdsInRoom[i] == players[j].id) {
                    playersInRoom.push(players[j]);
                }
            }
        }

        // For some reason Arrows are stored as objects already in room
        // But players are only stored as ids
        /*
        for(var k = 0; k < arrowIdsInRoom.length; k++) {
            for(var l = 0; l < arrows.length; l++) {
                if(arrowIdsInRoom[k] == arrows[l].id) {
                    arrowsInRoom.push(arrows[l]);
                }
            }
        }
        */
        //console.log(playersInRoom);
        //console.log(arrowsInRoom);

        for(var m = 0; m < playersInRoom.length; m++) {
            if(playersInRoom[m].sprite == undefined) { break; }

            for(var n = 0; n < arrowsInRoom.length; n++) {
                if(this.hasCollided(playersInRoom[m].sprite.x, playersInRoom[m].sprite.y, arrowsInRoom[n].sprite.x, arrowsInRoom[n].sprite.y) && playersInRoom[m].id != arrowsInRoom[n].belongsTo) {
                    var collision = {
                        player: playersInRoom[m],
                        arrow: arrowsInRoom[n]
                    }         
                    //console.log(collision);
                    return collision;
                }
            }
        }
    },

    hasCollided: function(x1, y1, x2, y2) {
        return !(((x1 + 16 - 1) < x2) ||
                 ((x2 + 16 - 1) < x1) ||
                 ((y1 + 16 - 1) < y2) ||
                 ((y2 + 16 - 1) < y1));
    }
}