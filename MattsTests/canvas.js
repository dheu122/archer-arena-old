var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;


// Drawing a rectangle
// ctx.fillRect(x,y,width,height);
// ctx.fillStyle = "rgba(255, 0 ,0 , 0.2)"; // changes the color of the fill
// ctx.fillRect(100, 100, 100, 100);

//Arcs/Circles
// ctx.arc(x, y, radius, start angle, end angle, drawCounterClockwise(bool))
// ctx.beginPath();
// ctx.arc(300, 300, 30,0, Math.PI * 2, false);
// ctx.strokeStyle = 'orange';
// ctx.stroke();

var mouse = {
  x: undefined,
  y: undefined
}

var maxRadius = 40;
var minLength = 2;

//Animations
window.addEventListener('mousemove', function(event){
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('resize', function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initRain();
  // initCircle();
  // initArrows();
})

//Arrow object
//_______________________________________
function Arrow(dx,dy,dWidth,dHeight,sx,sy,sWidth,sHeight,angle){
  this.dx = dx;
  this.dy = dy;
  this.dWidth = dWidth;
  this.dHeight = dHeight
  this.sx = sx;
  this.sy = sy;
  this.sWidth = sWidth;
  this.sHeight = sHeight;
  this.image = new Image();
  this.image.src = 'C:\\Users\\Matthew\\archer-arena\\assets\\arrow_sprite.png';
  this.angle = angle;

  this.update = function(){
    this.draw();
    ctx.setTranform(5,0,0,5,0,0);
  }

  this.image.onload = function(){
    this.update();
  }

  this.draw = function(){
    ctx.drawImage(this.image,this.dx,this.dy,this.dWidth,this.dHeight,this.sx,this.sy,this.sWidth,this.sHeight);
  }
}

//Moon object
//_______________________________________
function Moon(x,y,dx,dy,radius,fill, fill2){
  //Variable setting
  this.radius = radius;
  this.x = x - (this.radius*2);
  this.y = y - (this.radius*2);
  this.xOrig = x - (this.radius*2);
  this.yOrig = y - (this.radius*2);
  this.dx = dx;
  this.dy = Math.pow();
  this.fill = fill;
  this.fill2 = fill2;

  //called every frame in animation loop
  this.update = function(){
    //if goes off screen
    if(this.x - (this.radius*2)*2 > innerWidth){
      //Reset to origin
      this.x = this.xOrig;
      this.y = this.yOrig;
      this.dy = -this.dy;
    }
    if(this.x > innerWidth/2) {
      if(this.dy < 0) this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
    //Experimenting with path of moon
    // this.y = 600 - Math.sqrt((this.x-(this.radius*2)*100) - this.radius*8);
    this.draw();

  }

  //draws the object
  this.draw = function() {
    this.drawAura();

    ctx.beginPath();
    ctx.fillStyle = this.fill;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this.fill2;
    ctx.arc(this.x - this.radius/5, this.y + this.radius/3, this.radius/5, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this.fill2;
    ctx.arc(this.x + this.radius/3, this.y - this.radius/2, this.radius/3, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this.fill2;
    ctx.arc(this.x - this.radius/2, this.y - this.radius/4, this.radius/7, 0, Math.PI * 2, false);
    ctx.fill();
  }

  this.drawAura = function() {
    var gradient = ctx.createRadialGradient(this.x,this.y,this.radius*2,this.x,this.y,0);
    gradient.addColorStop(0,"#2c5294");
    gradient.addColorStop(.55,"white");
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2, false);
    ctx.fill();
  }
}

//Rain object
//_______________________________________
function Rain(x,y,dx,dy,length,color){
  //setting object variables
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.length = length;
  this.color = color;

  //function to be ran every frame in animate function
  this.update = function() {
    if(this.x - this.length/2 < 0) {
      this.x = Math.random() * (innerWidth - (400 * dx)) - (length * 2) + length;
      this.y = 0;
    }
    if(this.y + this.length/2 > innerHeight) {
      this.x = Math.random() * (innerWidth - (400 * dx)) - (length * 2) + length;
      this.y = 0;
    }
    this.y += this.dy;
    this.x += this.dx;

    this.draw();
  }

  // draws the object
  this.draw = function(){
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.dx, this.y + this.length); //this controls how the rain looks in relation to how it falls
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
}

//Circle object
//_______________________________________
function Circle(x, y, dx, dy, radius, fill){
  //setting object variables
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.fill = fill;

  //function to be ran every frame in animate function
  this.update = function() {
    if(this.x + this.radius > innerWidth || this.x - this.radius < 0) this.dx = -this.dx;
    if(this.y + this.radius > innerWidth || this.y - this.radius < 0) this.dy = -this.dy;
    this.y += this.dy;
    this.x += this.dx;

    // interactivity
    if(mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50){
      if(this.radius < maxRadius){
        this.radius += 2;
      }
    } else if (this.radius > this.minRadius){
      this.radius -= 2;
    }

    this.draw();
  }

  //draws the object
  this.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.fill;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
}
//_______________________________________

var circleArray = [];

var colorArray = [
  '#ffa500',
  '#343e48',
  '#887b75',
  '#397c9c'
];

var rainArray = [];

var moon = new Moon(200,600,.1,-.025,100,'white','#d3d3d3');
//initializes rain array and elements
function initRain(){
  rainArray = [];
  for(var i = 0; i < 500; i++){
    // var color = colorArray[Math.floor(Math.random() * colorArray.length)];
    var color = 'black';
    var length = ((Math.random() * 5 + minLength) * 2);
    var x = Math.random() * (innerWidth - (length * 2)) + length*2;
    var y = Math.random() * (innerHeight - (length)) + length;
    var dx = -3;
    var dy = ((Math.random()+1) * 4);
    rainArray.push(new Rain(x,y,dx,dy,length,color))
  }
}

var circleArray = [];
//initializes circle array and background
function initCircle(){
  circleArray = [];
  for (var i = 0; i < 300; i++){
    var fill = colorArray[Math.floor(Math.random() * colorArray.length)];
    var radius = ((Math.random() * 5 + 1) * 2);
    var x = Math.random() * (innerWidth - (radius * 2)) + radius;
    var y = Math.random() * (innerHeight - (radius * 2)) + radius;
    var dx = (Math.random() - 0.5) * 4;
    var dy = (Math.random() - 0.5) * 4;
    circleArray.push(new Circle(x,y,dx,dy,radius,fill));
  }
}

var arrowArray = [];
//initializes arrow array and background
function initArrows(){
  arrowArray = [];
  for (var i = 0; i < 360; i++){
    var dx = i * 16;
    var dy = i * 16;
    var dWidth = 15;
    var dHeight = 16;
    var sx = 0;
    var sy = 0;
    var sWidth = 15;
    var sHeight = 16;
    var angle = i * Math.PI * 2;
    arrowArray.push(new Arrow(dx,dy,dWidth,dHeight,sx,sy,sWidth,sHeight,angle));
  }
}

// initCircle();
initRain();
// initArrows();
//animate function clears the canvas and redraws all elements
//***The order of updates determines the layer position***
function animate(){
  requestAnimationFrame(animate);
  ctx.setTransform(1,0,0,1,0,0);
  //clear canvas
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  //draw circles
  // for (var i = 0; i < circleArray.length; i++){
  //   circleArray[i].update();
  // }
  moon.update();
  //draw rain
  for (var i = 0; i < rainArray.length; i++){
    rainArray[i].update();
  }
  //draw arrows
  // for (var i = 0; i < arrowArray.length; i++){
  //   arrowArray[i].update();
  // }
}
animate();
