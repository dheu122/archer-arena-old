var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socket(server);

var rooms = [];

/*
    Informal Room Interface {
        roomId: string,
        playersInRoom: [playerIds, ...],
        arrowsInRoom: [arrowIds, ...]
    }
*/

module.exports = {

    getRooms: function() {
        return rooms;
    },

    getRoomIndex: function(roomId) {
        for(var i = 0; i < rooms.length; i++) {
            if(roomId == rooms[i].roomId)
                return i;
        }
    },

    getArrowsInRoom: function(roomId) {
        for(var i = 0; i < rooms.length; i++) {
            if(roomId == rooms[i].roomId) 
                return rooms[i].arrowsInRoom;
        }
    },

    getPlayersInRoom: function(roomId) {
        for(var i = 0; i < rooms.length; i++) {
            if(roomId == rooms[i].roomId)
                return rooms[i].playersInRoom;
        }
    },

    createArrowInRoom: function(roomId, arrowId) {
        for(var i = 0; i < rooms.length; i++) {
            if(roomId == rooms[i].roomId) {
                rooms[i].arrowsInRoom.push(arrowId);
            }
        }
    },

    createAndJoinRoom: function(playerId) {
        var timestamp = new Date().getUTCMilliseconds();
        var roomId = timestamp + '-' + playerId;

        rooms.push({
            roomId: roomId,
            playersInRoom: [playerId],
            arrowsInRoom: []
        })

        console.log('Creating and joining new room: ' + roomId);
        return roomId;
    },

    joinRoom: function(playerId) {
        var chosenRoom = {};
        for(var i = 0; i < rooms.length; i++) {
            if(rooms[i].playersInRoom.length < 18) {
                chosenRoom = rooms[i];
                rooms[i].playersInRoom.push(playerId);
                console.log('Joining room id: ' + chosenRoom.roomId);
                return chosenRoom.roomId;
                // TODO: Load player into room, spawn character, etc, etc
            }
        }

        console.log('Unable to find room... creating new one');
        return this.createAndJoinRoom(playerId);
    },

    deleteRoom: function(roomId) {
        var roomIndex = this.getRoomIndex(roomId);
        rooms.splice(roomIndex, 1);

        console.log('Room id: ' + roomId + ' is empty... deleting room');
    },

    isRoomEmpty: function(roomId) {
        var roomIndex = this.getRoomIndex(roomId);

        if(rooms[roomIndex].playersInRoom.length == 0) {
            return true;
        } else {
            return false;
        }
    },

    removePlayerFromRoom: function(roomId, playerId) {
        var roomIndex = this.getRoomIndex(roomId);
        var room = rooms[roomIndex];

        for(var i = 0; i < room.playersInRoom.length; i++) {
            if(playerId == room.playersInRoom[i]) {
                room.playersInRoom.splice(i, 1);
            }
        }
    }
}