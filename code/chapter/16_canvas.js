var results = [
  {name: "Satisfied", count: 1043, color: "lightblue"},
  {name: "Neutral", count: 563, color: "lightgreen"},
  {name: "Unsatisfied", count: 510, color: "pink"},
  {name: "No comment", count: 175, color: "silver"}
];

// (itertaion2) moving sunrise
var sunriseStatus;
console.log("sunriseStatus : " + this.sunriseStatus);

function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}

var widthAdjust;
var heightAdjust;
//var adjustedCanvasPosX;
//var adjustedCanvasPosY;

console.log("widthAdjust : " + widthAdjust);

function CanvasDisplay(parent, level) {

  // (iteration6) screen adjusting
  if (this.aspectRatioCalculator() === "4:3") {
	  widthAdjust = window.innerWidth;
	  heightAdjust = window.innerWidth * 0.75;
  } else if (this.aspectRatioCalculator() === "16:9") {
	  widthAdjust = window.innerWidth;
	  heightAdjust = window.innerHeight;
  } else if (this.aspectRatioCalculator() === "16:10") {
	  widthAdjust = window.innerHeight / 0.5652;
	  heightAdjust = window.innerHeight;
  }
  console.log("widthAdjust : " + widthAdjust);
  
  //adjustedCanvasPosX = (window.innerWidth / 2) - (widthAdjust / 2);
  //adjustedCanvasPosY = (window.innerHeight / 2) - (heightAdjust / 2);
  
  this.canvas = document.getElementById("back");
  this.canvas.width = widthAdjust; //Math.min(window.innerWidth); //, level.width * scale);
  console.log("canvas.width : " + this.canvas.width);
  this.canvas.height = heightAdjust; //Math.min(window.innerHeight); //, level.height * scale);
  console.log("canvas.height : " + this.canvas.height);
  parent.appendChild(this.canvas);
  this.cx = this.canvas.getContext("2d");
  //this.canvas.style.left = adjustedCanvasPosX;
  //this.canvas.style.top = adjustedCanvasPosY;
  //this.canvas.position = "absolute";

  this.canvasMid = document.getElementById("mid");
  this.canvasMid.width = widthAdjust; //Math.min(window.innerWidth, level.width * scale);
  this.canvasMid.height = heightAdjust; //Math.min(window.innerHeight, level.height * scale);
  this.cxM = this.canvasMid.getContext("2d");
  //this.canvasMid.style.left = adjustedCanvasPosX;
  //this.canvasMid.style.top = adjustedCanvasPosY;
  //this.canvasMid.position = "absolute";

  this.canvasFront = document.getElementById("front");
  this.canvasFront.width = widthAdjust; //Math.min(window.innerWidth, level.width * scale);
  this.canvasFront.height = heightAdjust; //Math.min(window.innerHeight, level.height * scale);
  this.cxF = this.canvasFront.getContext("2d");
  //this.canvasFront.style.left = adjustedCanvasPosX;
  //this.canvasFront.style.top = adjustedCanvasPosY;
  //this.canvasFront.position = "absolute";

  this.canvasTop = document.getElementById("top");
  this.canvasTop.width = widthAdjust; //Math.min(window.innerWidth, level.width * scale);
  this.canvasTop.height = heightAdjust; //Math.min(window.innerHeight, level.height * scale);
  this.cxT = this.canvasTop.getContext("2d");
  //this.canvasTop.style.left = adjustedCanvasPosX;
  //this.canvasTop.style.top = adjustedCanvasPosY;
  //this.canvasTop.position = "absolute";
  
  this.canvasBkgd = document.getElementById("background");
  this.canvasBkgd.width = window.innerWidth; //Math.min(window.innerWidth, level.width * scale);
  this.canvasBkgd.height = window.innerHeight; //Math.min(window.innerHeight, level.height * scale);
  this.cxBk = this.canvasBkgd.getContext("2d");
  //this.canvasTop.style.left = adjustedCanvasPosX;
  //this.canvasTop.style.top = adjustedCanvasPosY;
  //this.canvasTop.position = "absolute";

  this.level = level;
  this.animationTime = 0;
  this.flipPlayer = false;

  this.viewport = {
    left: 0,
    top: 0,
    width: this.canvas.width / scale,
    height: this.canvas.height / scale
  };

  this.drawFrame(0);
}



  
  
CanvasDisplay.prototype.clear = function() {
	this.canvas.parentNode.removeChild(this.canvas);
	this.canvasMid.parentNode.removeChild(this.canvasMid);
	this.canvasFront.parentNode.removeChild(this.canvasFront);
	this.canvasTop.parentNode.removeChild(this.canvasTop);
};

CanvasDisplay.prototype.drawFrame = function(step) {
	this.animationTime += step;

	this.drawLandscape();
	//this.updateViewport();
	this.clearDisplay();
	this.drawBackground();
	this.drawActors(); 

	this.OpacityAdjust();
	this.morningChorus();
};

CanvasDisplay.prototype.updateViewport = function() {
  var view = this.viewport, margin = view.width / 3;
  var player = this.level.player;
  var center = player.pos.plus(player.size.times(0.5));

  if (center.x < view.left + margin)
    view.left = Math.max(center.x - margin, 0);
  else if (center.x > view.left + view.width - margin)
    view.left = Math.min(center.x + margin - view.width,
                         this.level.width - view.width);
  if (center.y < view.top + margin)
    view.top = Math.max(center.y - margin, 0);
  else if (center.y > view.top + view.height - margin)
    view.top = Math.min(center.y + margin - view.height,
                        this.level.height - view.height);
};

CanvasDisplay.prototype.clearDisplay = function() {
  this.cxM.clearRect(0, 0, 
					this.canvas.width, this.canvas.height);
  this.cx.fillStyle = "rgb(52, 166, 251)";
  this.cx.fillRect(0, 0,
					this.canvas.width, this.canvas.height);
};

// (iteration1) fade in
var fadeValue = 1;

CanvasDisplay.prototype.OpacityAdjust = function() {
	this.canvasTop.style.opacity = fadeValue;
	this.cxT.fillStyle = "black"; 
	this.cxT.fillRect(0, 0,
					this.canvasTop.width, this.canvasTop.height);
	if (fadeValue > 0) {
		fadeValue -= 0.0015;
	}
};

// (iteration4) playing a sound
var soundPlayed;

CanvasDisplay.prototype.morningChorus = function() {
	if (soundPlayed == null) {
		var morningSnd = new Audio("morning_chorus.mp3");
		morningSnd.loop = false;
		morningSnd.play();
		soundPlayed = "played";
		setTimeout(function() {
			morningSnd.pause(); 
		}, 20000);
	}
};

var otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.png";

CanvasDisplay.prototype.drawBackground = function() {
  this.cxBk.fillStyle = "Black";
  this.cxBk.fillRect(0, 0,
					window.innerWidth, window.innerHeight);
  
  /*var view = this.viewport;
  var xStart = Math.floor(view.left);
  var xEnd = Math.ceil(view.left + view.width);
  var yStart = Math.floor(view.top);
  var yEnd = Math.ceil(view.top + view.height);

  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var tile = this.level.grid[y][x];
      if (tile == null) continue;
      var screenX = (x - view.left) * scale;
      var screenY = (y - view.top) * scale;
      var tileX = tile == "sun" ? scale : 0;
      this.cx.drawImage(otherSprites,
                        tileX,         0, scale, scale,
                        screenX, screenY, scale, scale);
    }
  }*/
};

var background4x3 = document.createElement("img");
background4x3.src = "img/background4x3OG.png";

var background16x9 = document.createElement("img");
background16x9.src = "img/background16x9OG.png";

var background16x10 = document.createElement("img");
background16x10.src = "img/background16x10OG.png";

CanvasDisplay.prototype.drawLandscape = function() {
	var aspectImage;
	var srcX;
	var srcY;
	
	if (this.aspectRatioCalculator() === "4:3") {
		aspectImage = background4x3;
		srcX = 1920;
		srcY = 1440;
	} else if (this.aspectRatioCalculator() === "16:9") {
		aspectImage = background16x9;
		srcX = 1920;
		srcY = 1080;
	} else if (this.aspectRatioCalculator() === "16:10") {
		aspectImage = background16x10;
		srcX = 1920;
		srcY = 1200;
	}
	
	this.cxF.clearRect(0, 0, 
						this.canvas.width, this.canvas.height);
	this.cxF.drawImage(aspectImage,
						0, 0, srcX, srcY,
						0, 0, this.canvas.width, this.canvas.height);
};

CanvasDisplay.prototype.aspectRatioCalculator = function() {
	var aspectRatio;
	var ratioCalc = window.innerHeight / window.innerWidth; 
	
	if (ratioCalc >= 0.75) {
		aspectRatio = "4:3";
		//aspectImage = background4x3;
		//srcX = 1920;
		//srcY = 1440;
		//picX = this.canvas.width;
		//picY = this.canvas.width * 0.75;
	}
	else if (ratioCalc < 0.75 && ratioCalc >= 0.5652) {
		aspectRatio = "16:9";
		//aspectImage = background16x9;
		//srcX = 1920;
		//srcY = 1080;
		//picX = this.canvas.width;
		//picY = this.canvas.height;
	}
	else if (ratioCalc < 0.5652) {
		aspectRatio = "16:10";
		//aspectImage = background16x10;
		//srcX = 1920;
		//srcY = 1200;
		//picY = this.canvas.height;
		//picX = this.canvas.height / 0.5652;
	}
	return aspectRatio;
};


var playerSprites = document.createElement("img");
playerSprites.src = "img/player.png";
var playerXOverlap = 4;

CanvasDisplay.prototype.drawPlayer = function(x, y, width,
                                              height) {
  var sprite = 8, player = this.level.player;
  width += playerXOverlap * 2;
  x -= playerXOverlap;
  if (player.speed.x != 0)
    this.flipPlayer = player.speed.x < 0;

  if (player.speed.y != 0)
    sprite = 9;
  else if (player.speed.x != 0)
    sprite = Math.floor(this.animationTime * 12) % 8;

  this.cx.save();
  if (this.flipPlayer)
    flipHorizontally(this.cx, x + width / 2);

  this.cx.drawImage(playerSprites,
                    sprite * width, 0, width, height,
                    x, y, width, height);

  this.cx.restore();
};

// (iteration2) moving sun
var sunSprite = document.createElement("img");
sunSprite.src = "img/Sun 200x200.png";

var birdSprite = document.createElement("img");
birdSprite.src = "img/burd.png";

CanvasDisplay.prototype.drawActors = function() {
	this.level.actors.forEach(function(actor) {
    var width = actor.size.x * scale;
    var height = actor.size.y * scale;
    var x = (actor.pos.x - this.viewport.left) * scale;
    var y = (actor.pos.y - this.viewport.top) * scale;
    if (actor.type == "player") {
      this.drawPlayer(x, y, width, height);
	} else if (actor.type == "bird") {
		this.cxF.drawImage(birdSprite, 
							x, y, 100, 50);
	} else {
      //var tileX = (actor.type == "bird" ? 2 : 1) * scale;
      //this.cxM.clearRect(0, 0, this.canvas.width, this.canvas.height);
	  this.cxM.drawImage(sunSprite/*otherSprites*/,
                        0, 0, 200, 200, //tileX, 0, width, height,
                        x, y, 100, 100); //width, height);
      
      // (iteration3) glow around the sun
      var gradient = this.cx.createRadialGradient((x + 50),(y + 50), 100,(x + 50),(y + 50), 0);
      gradient.addColorStop(0,"rgb(52, 166, 251)");
      gradient.addColorStop(1,"white");
      this.cx.fillStyle = gradient;
      this.cx.fillRect((x - 50), (y - 50), 200, 200);
    } 
  }, this);
};
