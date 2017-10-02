var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socket(server);

var players = [];

/*
    Informal Player Interface {
        roomId: string,
        playersInRoom: [playerIds, ...]
    }
*/

module.exports = {

    getPlayers: function() {
        return players;
    },

    deletePlayerAt: function(index) {
        players.splice(index, 1);
    },

    addPlayerToServer: function(playerData, socketId, roomId) {
        players.push({          // Pushes the player's info into the array
            name: playerData.name,
            id: socketId,
            isInThisRoom: roomId
        });
    }
}