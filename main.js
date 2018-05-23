// var count =0;
var pTime =0;
function setup(){
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  //var canvas = createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
  //createCanvas(windowWidth, windowHeight);
  if(window.innerHeight>=window.innerWidth*9/16){
    var canvas = createCanvas(window.innerWidth, window.innerWidth*9/16);
  }else{
    var canvas = createCanvas(window.innerHeight*16/9, window.innerHeight);
  }
  //console.log("Here");
  randomSeed(1);//get the same random numbers everytime 
  oxygen2 = new Gas(50,300);
  oxygen2.initialize();
  // noLoop();
  frameRate(60);
  background(240);
  
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  // canvas.parent('sketch-holder');
}
function draw(){
  //drawGrid();
  background(218);

  oxygen2.display();
  // if(oxygen2.t-pTime>2){  
  //   background(51,51,51,50);
  // } 
  if(oxygen2.t-pTime>1){  
    pTime = oxygen2.t;
  }  
   // console.log("here");
  oxygen2.calculateEvents();
  oxygen2.advanceToNextCollision();
  
}
function windowResized() { 
  // resizeCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight); 
  if(window.innerHeight>=window.innerWidth*9/16){
    resizeCanvas(window.innerWidth, window.innerWidth*9/16);
  }else{
    resizeCanvas(window.innerHeight*16/9, window.innerHeight);
  }
  //resizeCanvas(windowWidth, windowHeight);
}
function mouseClicked() {
  redraw(1);
}

// The following code can be used to draw a grid
// function drawGrid() {
// 	stroke(200);
// 	fill(120);
// 	for (var x=-width; x < width; x+=40) {
// 		line(x, -height, x, height);
// 		text(x, x+1, 12);
// 	}
// 	for (var y=-height; y < height; y+=40) {
// 		line(-width, y, width, y);
// 		text(y, 1, y+12);
// 	}
// }