var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socket(server);

var room = require('./room');

var pickups = [];

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

  addPickupToRoom(roomId, pickupPosition) {
    var timestamp = new Date().getUTCMilliseconds(); //time in milliseconds
    var idString = Math.random().toString(36).substring(7); //random 5 letter string
    var pickupObj = {
      id: 'pickup-' + roomId + '-' + idString + '-' + timestamp,
      x: pickupPosition.x,
      y: pickupPosition.y,
    }
    room.createPickupInRoom(roomId, pickupObj);
  },

  removePickupFromRoom(roomId, pickupId) {
    room.removePickupFromRoom(roomId, pickupId);
  }
}