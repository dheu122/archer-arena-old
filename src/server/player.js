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
        name: string,
        id: string,
        isInThisRoom: string,
        sprite: Sprite Object = {
                image: Image,
                width: number,
                height: number,
                isSpriteSheet: boolean,
                x: number,
                y: number,
                index: number
            }
        speed: number,
        stamina: number
    }
*/

module.exports = {

    getPlayers: function() {
        return players;
    },

    getPlayerIndexById: function(id) {
        for(var i = 0; i < players.length; i++) {
            if(players[i].id == id) {
                return i;
            }
        }
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
    },

    // Generic function to update ALL parameters of a player
    // May need to divide for individual functions
    updatePlayer: function(playerData, socketId, roomId) {
        if(playerData.isInThisRoom == roomId) {
            for(var i = 0; i < players.length; i++) {
                if(players[i].id == socketId) {
                    players[i] = playerData;
                }
            }
        } else {
            console.log("Player " + socketId + " is not in room " + roomId + " :: is in room " + playerData.isInThisRoom);
        }
    }
}