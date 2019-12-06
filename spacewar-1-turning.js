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
}

// This function moves a spaceship (or other things).
let moveThing = function(thing){
  // Turn the thing.
  thing.angle += thing.turn;
}

let ship = {x: 20, y: 20, angle: 0,
            color: turtle.makeColor(60,197,24), turn:0};

// controls go in one of these 2 places
document.addEventListener("keydown", function(keyEvent){
  // Code that runs when you press a key goes in here.
  console.log(keyEvent.key); // Print the name of the pressed key.
  if(keyEvent.key == "a"){
    ship.turn = 5; // Turn counterclockwise (left) with "a".
  } else if(keyEvent.key == "d"){
    ship.turn = -5; // Turn clockwise (right) with "d".
  }
});

document.addEventListener("keyup", function(keyEvent){
  if(keyEvent.key == "a" || keyEvent.key == "d"){
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
  
  turtle.show(); // Put pixels on the screen -- must be last!
};
window.requestAnimationFrame(gameFrame); // Make the first frame be drawn.
