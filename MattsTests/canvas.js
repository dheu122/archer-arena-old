var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');

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
})

//Moon object
//_______________________________________
function Moon(x,y,dx,dy,radius){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;

  ctx.drawImage(moon, -3.5, -3.5);

}

//Rain object
//_______________________________________
function Rain(x,y,dx,dy,length,color){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.length = length;
  this.color = color;

  this.update = function() {
    if(this.x + this.length/2 > innerWidth || this.x - this.radius < 0) {
      this.x = Math.random() * (innerWidth - (length * 2)) + length;
      this.y = 0;
    }
    if(this.y + this.length/2 > innerHeight) {
      this.x = Math.random() * (innerHeight - (length * 2)) + length;
      this.y = -1;
    }
    this.y += this.dy;
    this.x += this.dx;

    this.draw();
  }

  this.draw = function(){
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.length);
    ctx.strokeStyle = "black";
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
//initializes rain array and elements
function initRain(){
  rainArray = [];
  for(var i = 0; i < 500; i++){
    var color = colorArray[Math.floor(Math.random() * colorArray.length)];
    var length = ((Math.random() * 5 + minLength) * 2);
    var x = Math.random() * (innerWidth - (length * 2)) + length*2;
    var y = Math.random() * (innerHeight - (length)) + length;
    var dx = 0;
    var dy = (Math.random()+1) * 4;
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

// initCircle();
initRain()
//animate function clears the canvas and redraws all elements
function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  // for (var i = 0; i < circleArray.length; i++){
  //   circleArray[i].update();
  // }
  for (var i = 0; i < rainArray.length; i++){
    rainArray[i].update();
  }
}
animate();
