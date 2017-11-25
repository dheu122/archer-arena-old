var UI = {
    
    characterIndex: 0,
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
                document.getElementById('titlescreen').remove();
            }
        }
        request.open("GET", "../../assets/profanity.json", true);
        request.send();
        return nickname;
    },

    setCharacterIndex: function(left) {
        if(left == true && UI.characterIndex > 0) { UI.characterIndex--; }
        else if(left == false && UI.characterIndex < 5) { UI.characterIndex++; }
    },

    login() {
        var loginData = {
            name: UI.getUsername(),
            characterIndex: UI.characterIndex
        }
        socket.emit('ConnectToServer', loginData);
    },

    loadHidden: function(click, divID) {
        var item = document.getElementById(divID);
        if (item) {
            if(item.className == 'hidden') {
                item.className = 'unhidden';
                click.value = 'hide'
            }
            else {
                item.className = 'hidden';
                click.value = 'unhide'
            }
        }
    }
}
// Manual browser testing functions will go here