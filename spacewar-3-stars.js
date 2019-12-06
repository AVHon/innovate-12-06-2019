/* jshint moz: true */  // Incantation to make jsbin not complain about "let".
// This javascript expects something like `turtle.html` in your HTML.
let desiredFrameRate = 15; // frames per second
let desiredDelay = 1000 / desiredFrameRate;
let lastFrameTime = 0;

let turtle = new Turtle();

let drawShip = function(ship){
  turtle.jumpTo(ship.x, ship.y); // Go to where the ship is.
  turtle.turnTo(ship.angle); // Face the way the ship is facing.
  
  turtle.setColor(ship.color); // use the ship's color
  
  // Go from the center of the ship to its edge, and draw the outline.
  turtle.penUp();
  turtle.move(-3);
  turtle.penDown();
  turtle.turn(120);
  turtle.move(8);
  turtle.turn(-140);
  turtle.move(20);
  turtle.turn(-140);
  turtle.move(20);
  turtle.turn(-140);
  turtle.move(8);
  turtle.turn(-60);
  // That's it -- the outline of the ship has been drawn!
  
  // Go back to the middle of the ship.
  turtle.jumpTo(ship.x, ship.y);

  turtle.pour(); // Color the inside of the ship.

  // Make a white mark in the middle of the ship.
  turtle.setColor(turtle.makeColor(255,255,255));
  turtle.tapPen();
  
  // Draw the engine flame if the engine is firing.
  if(ship.throttle > 0){
    turtle.turnTo(ship.angle + 180); // Face the back of the ship.
    turtle.penUp();
    turtle.move(4); // Go to the back of the ship.
    // Make the flame waver in angle and length.
    let flameAngle = Math.random()*20 - 10;
    let flameLength = 1 + Math.random() * ship.throttle * 32;
    turtle.turn(flameAngle);
    turtle.setColor(turtle.makeColor(255, 0, 0));
    turtle.penDown();
    turtle.move(flameLength); // Draw the flame.
  }
}

// This function moves a spaceship (or other things).
let moveThing = function(thing){
  // Change the thing's speed if its engine is firing.
  // If the thing doesn't have an engine, this harmlessly does nothing.
  if(thing.throttle > 0){
    // Use trigonometry to calculate how hard the engine pushes ↔ and ↕.
    thing.speedX += thing.throttle*Math.cos(thing.angle*Math.PI/180);
    thing.speedY -= thing.throttle*Math.sin(thing.angle*Math.PI/180);
  }
  
  // Move and turn the thing.
  thing.x += thing.speedX;
  thing.y += thing.speedY;
  thing.angle += thing.turn;

  // Keep the thing inside the screen (the turtle's canvas).
  if(thing.x < 0)                    {thing.x += turtle.canvas.width;}
  if(thing.x >= turtle.canvas.width) {thing.x -= turtle.canvas.width;}
  if(thing.y < 0)                    {thing.y += turtle.canvas.height;}
  if(thing.y >= turtle.canvas.height){thing.y -= turtle.canvas.height;}
}

let ship = {x: 20, y: 20, angle: 0, speedX: 0, speedY: 0, throttle: 0,
            color: turtle.makeColor(60,197,24), turn:0};

let stars = []; // Start with no stars.
let addStars = function(n){
  if(n<=0){
    return;
  }
  stars.push({x: Math.random()*turtle.canvas.width,
              y: Math.random()*turtle.canvas.height});
  addStars(n-1);
}
addStars(100); // Make 100 random stars at the start of the game.

let drawStar = function(star){
  turtle.jumpTo(star.x, star.y);
  // Don't draw stars where ships are. (only works if ships are already drawn)
  if(! turtle.colorsEqual(turtle.getCanvasColor(), ship.color)){
    turtle.setColor(turtle.makeColor(255,255,255));
    turtle.tapPen();
  }
}

// controls go in one of these 2 places
document.addEventListener("keydown", function(keyEvent){
  // Code that runs when you press a key goes in here.
  console.log(keyEvent.key); // Print the name of the pressed key.
  if(keyEvent.key == "s"){
    ship.throttle = 0.5; // Start firing the engine when "s" is pressed.
  } else if(keyEvent.key == "a"){
    ship.turn = 5; // Turn counterclockwise (left) with "a".
  } else if(keyEvent.key == "d"){
    ship.turn = -5; // Turn clockwise (right) with "d".
  }
});

document.addEventListener("keyup", function(keyEvent){
  if(keyEvent.key == "s"){
    ship.throttle = 0; // Stop firing the engine when "s" is released.
  } else if(keyEvent.key == "a" || keyEvent.key == "d"){
    ship.turn = 0; // Stop turning when "a" or "d" is released.
  }
});

let gameFrame = function(now) {
  // Ask for the web browser to draw another frame after this one.
  window.requestAnimationFrame(gameFrame); // Without this, the game would stop.
  
  // Don't let the frame rate get too high -- be kind to batteries and fans
  if(now < lastFrameTime + desiredDelay){return;}
  lastFrameTime = now;

  // Game update and drawing code goes here!
  // Fill the window with black.
  turtle.setColor(turtle.makeColor(0,0,0));
  turtle.clear();

  // Move everything that moves.
  moveThing(ship);
  
  // Draw the ship.
  drawShip(ship);
  
  // Draw everything else.
  stars.forEach(drawStar);
  
  turtle.show(); // Put pixels on the screen -- must be last!
};
window.requestAnimationFrame(gameFrame); // Make the first frame be drawn.
