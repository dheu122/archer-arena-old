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
//(ex. IsMoving, IsShooting, DirectionOfMovement)

var animator = {

  Parameters: {
    IsRunning
  }

}
