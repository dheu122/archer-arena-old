// Server-related functions will go here
var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socket(server);

var players = [];
var rooms = [];

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
        var data = playerData; // information such as nicknames, location?, character

        players.push({
            name: data.name,
            id: socket.id,
        });

        console.log('Connection id: ' + players[players.length-1].id + ' has connected to the server');
    })

    socket.on("DisconnectFromServer", function(playerData) {
        var data = playerData;

        for(var i = 0; i < players.length; i++) {
            if(players[i].id == socket.id) {
                players.splice(i, 1);
            }
        }

        console.log('Connection id: ' + socket.id + 'has disconnected from the server');
    })
});

