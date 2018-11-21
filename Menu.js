//Menu Library for Javascript (canvas)
//N0il
//Note: put script library after <canvas></canvas>
var mouse_x = 0, mouse_y = 0;
var mouse_x2 = 0, mouse_y2 = 0;
var open = 0, components = [];
var canv = document.getElementById("menuCanvas");
var rect = canv.getBoundingClientRect();

ctx = document.querySelector("canvas").getContext("2d");

function getCoords(e) {
  mouse_x = e.clientX - rect.left;
  mouse_y = e.clientY - rect.top;
}

function Click(e) {
  mouse_x2 = e.clientX - rect.left;
  mouse_y2 = e.clientY - rect.top;

  for (var component of components) {
    let was_clicked = component.clicked();
    if (was_clicked) break;
  }
}

window.addEventListener("mousemove", getCoords);
window.addEventListener("click", Click);

function fullWindow() {
  var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  ctx.canvas.height = h;
  ctx.canvas.width = w;
}

function fullScreen(){
 if (canv.requestFullscreen) {
    canv.requestFullscreen();
  } else if (canv.mozRequestFullScreen) { /* Firefox */
    canv.mozRequestFullScreen();
  } else if (canv.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    canv.webkitRequestFullscreen();
  } else if (canv.msRequestFullscreen) { /* IE/Edge */
    canv.msRequestFullscreen();
  }
}

function createComponents(){
  for (var component of components) {
	component.hovered();
    component.draw();
  }
}


class Page {
  constructor(fWindow, fScreen, id, backColor, width, height) {
    this.id = id;
    this.backColor = backColor;
	this.fWindow = fWindow;
    this.fScreen = fScreen;
	  this.width = ctx.canvas.width; 
	  this.height = ctx.canvas.height;
    if (this.fScreen) {
		fullScreen();
    }
	if (this.fWindow) {
      fullWindow();
    }
  }
	
  draw() {
    open = this.id;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.fillStyle = this.backColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

class Button {
  constructor(name, id, x, y, width, height, fontSize, clickedFunction, defaultButton, backColor, color, hoveredBackColor, hoveredColor, fonte) {
	
    this.name = name;
	this.id = id;
	this.x = x;
    this.y = y;
	this.width = width;
    this.height = height;
	this.fontSize = fontSize;
	this.clickedFunction = clickedFunction;
	this.defaultButton = defaultButton;
	this.backColor = backColor;
    this.color = color;
    this.hoveredBackColor = hoveredBackColor;
    this.hoveredColor = hoveredColor;
    this.font = fontSize + "px " + fonte;
    this.disable = false;
    this.hover = false;
	  
		if(this.defaultButton == undefined){
    		this.backColor = "#FFFFFF";
    		this.color = "#000000";
    		this.hoveredBackColor = "#000000";
    		this.hoveredColor = "#FFFFFF";
    		this.font = fontSize + "px " + "Arial";
		}
  }

  hovered() {
    var left = this.x;
    var right = this.x + this.width;
    var top = this.y;
    var bottom = this.y + this.height;
    if (!this.disable && this.id == open) {
      this.hover = true;
      if (bottom < mouse_y || top > mouse_y || right < mouse_x || left > mouse_x) {
        this.hover = false;
      }
      return this.hover;
    }
  }
	
  clicked() {
    var left = this.x;
    var right = this.x + this.width;
    var top = this.y;
    var bottom = this.y + this.height;
    if (!this.disable && this.id == open) {
      var clicked = true;
      if (bottom < mouse_y2 || top > mouse_y2 || right < mouse_x2 || left > mouse_x2) {
        clicked = false;
      }
      if (clicked) {
        this.clickedFunction();
      }
    }
  }

  draw() {
    if (this.id == open) {
      ctx.beginPath();
      if (this.hovered()) {
        ctx.fillStyle = this.hoveredBackColor;
      } else {
        ctx.fillStyle = this.backColor;
      }
	  ctx.fillRect(this.x, this.y, this.width, this.height);
      if (this.hovered()) {
        ctx.fillStyle = this.hoveredColor;
      } else {
        ctx.fillStyle = this.color;
      }
      ctx.font = this.font;
      var textWidth = ctx.measureText(this.name).width;
      var textX = this.x + this.width / 2 - textWidth / 2;
      var textY = this.y + this.height / 2 + this.fontSize / 2;
      ctx.fillText(this.name, textX, textY, (this.width));  //final parameter not correct
    }
  }
}

class inputText {
	constructor(id, x, y, defaultInput, name, color, backColor, width){
		this.id = id;
		this.x = x;
    	this.y = y;
		this.defaultInput = defaultInput;
		this.name = name;
		this.color = color;
		this.backColor = backColor;
		this.width = width;
		this.height = 26;
		this.fontSize = 13;
		this.font = this.fontSize + "px " + "Arial";
		this.border = 1.5;
		
			if(this.defaultInput == undefined){
				this.name = "Input text here...";
				this.color = "#696969";
				this.backColor = "#FFFFFF";
				this.width = 180;
			}
	}
	draw(){
		if(this.id = open){
			ctx.fillStyle = "#000000";
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.fillStyle = this.backColor;
			ctx.fillRect(this.x + this.border, this.y + this.border, this.width - this.border*2, this.height - this.border*2);
			ctx.fillStyle = this.color;
			ctx.font = this.font;
			var textWidth = ctx.measureText(this.name).width;
			var textX = this.x + this.border + 4	;
        	var textY = this.y + this.height / 2 + this.fontSize / 2 - this.border;
			ctx.fillText(this.name, textX, textY);
		}
	}
	clicked() {
    var left = this.x;
    var right = this.x + this.width;
    var top = this.y;
    var bottom = this.y + this.height;
    	if (this.id == open) {
      		var clicked = true;
      		if (bottom < mouse_y2 || top > mouse_y2 || right < mouse_x2 || left > mouse_x2) {
				clicked = false;
			}
      		if (clicked) {
        		window.alert("Clicked in input box");
			}
		}
  	}
	hovered(){}
}
