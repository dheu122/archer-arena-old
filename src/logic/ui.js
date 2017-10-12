var socket = io();

var UI = {
    
    // Title screen, Game UI, and other UI-related function objects will go here
    getUsername: function() {
        var nickname = document.getElementById('username').value;

        socket.emit('ConnectToServer', {name: nickname});
        document.getElementById('titlescreen').remove();
    }
}
    
// Manual browser testing functions will go here