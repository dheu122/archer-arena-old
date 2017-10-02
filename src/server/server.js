// Server-related functions will go here
var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socket(server);

var room = require('./room');
var player = require('./player');

/*
    Informal Player Interface {
        name: string,
        id: string,
        isInThisRoom: string
    }
*/

app.set('port', 4200);
app.use('/', express.static(path.join(__dirname, '../../')));

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../../index.html'));
});

server.listen(4200, function() {
    console.log('Starting server on port 4200');
});

io.on('connection', function(socket) {

    socket.on('ConnectToServer', function(playerData) {
        console.log('Connecting using id: ' + socket.id);
        var data = playerData;  // information such as nicknames, location?, character
        var roomId = room.joinRoom(socket.id);

        socket.join(roomId);    // Join a socket.io room 
        player.addPlayerToServer(playerData, socket.id, roomId); // Adds player to player array for server
    })

    socket.on("disconnect", function(playerData) {
        var data = playerData;
        var players = player.getPlayers();

        for(var i = 0; i < players.length; i++) {
            if(players[i].id == socket.id) {
                room.removePlayerFromRoom(players[i].isInThisRoom, players[i].id);
                if(room.isRoomEmpty(players[i].isInThisRoom)) {
                    room.deleteRoom(players[i].isInThisRoom);
                }
                player.deletePlayerAt(i);
            }
        }

        console.log('Connection id: ' + socket.id + ' has disconnected from the server');
    })
});

