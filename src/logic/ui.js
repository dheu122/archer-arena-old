var UI = {
    
    // Title screen, Game UI, and other UI-related function objects will go here
    getUsername: function() {
        var nickname = document.getElementById('username').value;


        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
          if ((request.readyState == 4) && (request.status == 200)) {// if DONE and SUCCESS
                var profanityJson = JSON.parse(request.responseText);
                var profanityList = profanityJson.profanity;
                for(var i = 0; i < profanityList.length; i++) {
                    if(nickname.includes(profanityList[i])) {
                        alert("The word '" + profanityList[i] + "' was found in your name, please enter another one");
                        return;
                    }
                }
                socket.emit('ConnectToServer', {name: nickname});
                document.getElementById('titlescreen').remove();
            }
        }
        request.open("GET", "../../assets/profanity.json", true);
        request.send();

    }

}
// Manual browser testing functions will go here