//This file will handle animations, their states, and transitions between
//states

//Animator will be a component of an object (i.e. player, tile, arrow,
//ambient wildlife?)

//Animator's job will be to handle various states of animation of an object

//An animation will consist of various frames strung together and played in
//a loop or in specified sequence.
    //animation variables
    //speed
    //starting index
    //ending index
    //animation type

//A state will be a specific instance that will correspond to a specific
//animation (i.e. dying, running right, etc.)

//A trasition will be a switch between states of animation based on specific
//conditions (ex TransitionTo: idle Condition: IsMoving = false)
//Conditions will be a list (array) of condition checks

//Parameters of animation are checked before deciding to transition
//between states or not.

//Parameters will be bools for now..
//(ex. IsMoving, IsShooting)

var animTimer = 0;

var Animator = {

  Parameters: {

    isMovingDown: false,
    isMovingUp: false,
    isMovingLeft: false,
    isMovingRight: false,
    isRunning: false,
    isDrawing: false,
    isShooting: false,
    isDodging: false,

  },

  //Animator will handle which animation state the player will be in
  animator: function(options){

    this.isSpriteSheet = options.isSpriteSheet;
    this.width = options.width;
    this.height = options.height;
    this.index = options.index;

    //Default State
    // this.animate(State[idleRight].startingIndex, State[idleRight].endingIndex, State[idleRight].speed, State[idleRight].type);
    // var curState = 'idleRight';
    // var newState = '';

    var State = {
      idleRight: {startingIndex: 0, endingIndex: 0, speed: 10, type: 'loop'},
      idleLeft: {startingIndex: 3, endingIndex: 3, speed: 10, type: 'loop'},
      idleUp: {startingIndex: 9, endingIndex: 9, speed: 10, type: 'loop'},
      idleDown: {startingIndex: 6, endingIndex: 6, speed: 10, type: 'loop'},
      movingRight: {startingIndex: 1, endingIndex: 2, speed: 10, type: 'loop'},
      movingLeft: {startingIndex: 4, endiengIndex: 5, speed: 10, type: 'loop'},
      movingUp: {startingIndex: 10, endingIndex: 11, speed: 10, type: 'loop'},
      movingDown: {startingIndex: 7, endingIndex: 8, speed: 10, type: 'loop'},
    }

    //Default State
    this.animate(State.idleRight.startingIndex, State.idleRight.endingIndex, State.idleRight.speed, State.idleRight.type);
    var curState = 'idleRight';
    var newState = '';

    this.setState = function(newState){
      this.animate(State[newState].startingIndex, State[newState].endingIndex, State[newState].speed, State[newState].type);
      curState = newState;
    }

    this.checkTransitions = function(){
      //Check Transitions for idleRight
      if(curState == 'idleRight'){
        //movingLeft Transition
        if(movingLeft == true) { setState(movingLeft); }
        //movingRight Transition
        if(movingRight == true) { setState(movingRight); }
      }
      //Check Transitions for idleLeft
      if(curState = 'idleLeft'){
        //movingLeft Transition
        if(movingLeft == true) { setState(movingLeft); }
        //movingRight Transition
        if(movingRight == true) { setState(movingRight); }
      }
      //Check Transitions for idleUp
      if(curState == 'idleUp'){

      }
      //Check Transitions for idleDown
      if(curState == 'idleDown'){

      }
      //Check Transitions for movingRight
      if(curState == 'movingRight'){

      }
      //Check Transitions for movingLeft
      if(curState == 'movingLeft'){

      }
      //Check Transitions for movingUp
      if(curState == 'movingUp'){

      }
      //Check Transitions for movingLeft
      if(curState == 'movingDown'){

      }

    }

    this.setIndex = function(i) {
        this.index = i;
    },

    this.animate = function(startIndex, endIndex, animateSpeed, animateType) {
        if(!this.isSpriteSheet) {
            console.log("You cannot animate a single sprite, set isSpriteSheet to true");
        }
        else {
            var i = this.index;
            if(i < startIndex || i > endIndex) i = startIndex - 1; //smoothes out transition between animation changes
            if(animTimer > animateSpeed) {
                if(startIndex < endIndex) {
                    if(i < endIndex) {
                        i++;
                        this.setIndex(i);
                    }
                    else {
                        if(animateType == 'pingpong') {
                            var temp = startIndex;
                            startIndex = endIndex;
                            endIndex = temp;
                            i--;
                            this.setIndex(i);
                        }
                        else if (animateType == 'loop') {
                            i = startIndex;
                            this.setIndex(i);
                        }
                    }
                }
                else if (startIndex > endIndex) {
                    if(i > endIndex) {
                        i--;
                        this.setIndex(i);
                    }
                    else {
                        if(animateType == 'pingpong') {
                            var temp = startIndex;
                            startIndex = endIndex;
                            endIndex = temp;
                            i++;
                            this.setIndex(i);
                        }
                        else if (animateType == 'loop') {
                            i = startIndex;
                            this.setIndex(i);
                        }
                    }
                }
                animTimer = 0;
            }
        }
    }
  },

}

setInterval(function() {
    animTimer++;
}, 1000 / 60)
