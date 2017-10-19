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
var arrow = require('./arrow');

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

server.listen(process.env.PORT || 4200, function() {
    console.log('Starting server on port 4200');
});

io.on('connection', function(socket) {

    socket.on('ConnectToServer', function(playerData) {
        console.log('Connecting using id: ' + socket.id);
        var data = playerData;  // information such as nicknames, location?, character
        var roomId = room.joinRoom(socket.id);
        var identity = {
            roomId: roomId,
            id: socket.id
        }

        socket.join(roomId);    // Join a socket.io room 
        player.addPlayerToServer(playerData, socket.id, roomId); // Adds player to player array for server
        
        socket.emit('JoinedRoom', identity);
    })

    socket.on('SendPlayerData', function(data) {
        player.updatePlayer(data.playerData, socket.id, data.roomId);

        var players = player.getPlayers();
        var playerIds = room.getPlayersInRoom(data.roomId); // Get the player ids from the room the player is in.
        var playersInRoom = [];

        if(!playerIds) {
            return;
        }

        for(var i = 0; i < playerIds.length; i++) {
            for(var j = 0; j < players.length; j++) {
                if(playerIds[i] == players[j].id) {
                    playersInRoom.push(players[i]);
                    break;
                }
            }
        }
        // Using the player id, get their information and put that in an array.

        io.sockets.in(data.roomId).emit('GetRoomPlayerData', playersInRoom);
    })

    socket.on('AddArrowData', function(data) {
        room.createArrowInRoom(data.isInThisRoom, data);
        arrow.addArrowToServer(data, socket.id, data.isInThisRoom);
    })

    socket.on('RemoveArrowData', function(data) {
        var arrowIndex = arrow.getArrowIndexById(data.id);
        arrow.deleteArrowAt(arrowIndex);
    })

    socket.on('SendArrowData', function(data) {
        var arrowIds = room.getArrowsInRoom(data.roomId);
        var arrowsInRoom = [];

        arrowsInRoom = arrow.updateAllArrowsInRoom(arrowIds);

        io.sockets.in(data.roomId).emit('GetRoomArrowData', arrowsInRoom);
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

