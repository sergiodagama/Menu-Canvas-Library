//Menu Library for Javascript (canvas)
//N0il
//Note: put script library after <canvas></canvas>
//Note: cannot pass function to buttons from Menu, like Page.draw
var mouse_x = 0, mouse_y = 0;
var mouse_x2 = 0, mouse_y2 = 0;
var open = 0, components = [];
var value = "", isWriting, lastChar;
var fullName = "", textX, textY;
var isDragging = false, arcHovered = false;
var pageBackColor = [];
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
fullWindow();
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
        document.write("<button onclick='fullScreen();'>Open Menu in Fullscreen Mode</button>");
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

class Component {
	constructor(id, x, y, name, color, backColor, width){
		this.id = id;
		this.x = x;
		this.y = y;
		this.name = name;
		this.color = color;
		this.backColor = backColor;
		this.width = width;
		this.hover = false;
	}
	
	hovered() {
    var left = this.x;
    var right = this.x + this.width;
    var top = this.y;
    var bottom = this.y + this.height;
    if (this.id == open) {
      this.hover = true;
      if (bottom < mouse_y || top > mouse_y || right < mouse_x || left > mouse_x) {
        this.hover = false;
      }
      return this.hover;
    }
  }
}

class Button extends Component {
  constructor(id, x, y, name, clickedFunction, color = "#000000", backColor = "#FFFFFF", width = 100, height = 50, hoveredBackColor = "#000000", hoveredColor = "#FFFFFF", fonte = "Arial", fontSize = 15) {
	super(id, x, y, name, color, backColor, width);
    this.height = height;
	this.fontSize = fontSize;
	this.clickedFunction = clickedFunction;
    this.hoveredBackColor = hoveredBackColor;
    this.hoveredColor = hoveredColor;
    this.font = fontSize + "px " + fonte;
    this.hover = false;
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

window.addEventListener('keypress', writing);
window.addEventListener("keydown", specialKeys);

function specialKeys(event){  //because keypress doesn't listen to special keys
	  var key = event.which || event.keyCode;
	  console.log(key);
		if(key == 13){
			isWriting = false;
			return value;
		}
	    if(key == 8){
			isWriting = true;
			value = value.slice(0, value.length - 1);
		}
}
function writing(event){  //because keydown doesn't listen to all char's
  if(isWriting){
	  var key = event.which || event.keyCode;
	  value = this.value + String.fromCharCode(key);
  }
}	

class inputText extends Component{
	constructor(id, x, y, name = "Input text here...", color = "#696969", backColor = "#FFFFFF", width = 180){
		super(id, x, y, name, color, backColor, width);
		this.height = 26;
		this.fontSize = 13;
		this.font = this.fontSize + "px " + "Arial";
		this.border = 1.5;
	}
	draw(){
		if(this.id == open){
			if(this.hovered()){
				ctx.fillStyle = "#0000FF";
			   }else{
			   	ctx.fillStyle = "#000000"
			   }
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.fillStyle = this.backColor;
			ctx.fillRect(this.x + this.border, this.y + this.border, this.width - this.border*2, this.height - this.border * 2);
			if(isWriting){
				this.color = "#000000"
				this.name = value;
			}
			    var textWidth = ctx.measureText(this.name).width;
				ctx.fillStyle = this.color;
				ctx.font = this.font;
				textX = this.x + this.border + 4;
        	    textY = this.y + this.height / 2 + this.fontSize / 2 - this.border;
			if(textWidth <= this.width){  
				ctx.fillText(this.name, textX, textY);
				fullName = this.name;
			}
			else{
				isWriting = false;
				ctx.fillText(fullName, textX, textY);
			}
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
				isWriting = false;
			}
				if (clicked) {
					isWriting = true;
					specialKeys();
           			writing();
      			}
		}
	}
  	
}

class percentageBar extends Component{
	constructor(id, x, y, name, color, backColor, width, height, arcColor, fontSize, arc_x){
		super(id, x, y, name, color, backColor, width);
		this.width = width;
		this.height = height;
		this.arcColor = arcColor;
		this.fontSize = fontSize;
		this.font = this.fontSize + "px " + "Arial";
		this.arc_x = arc_x;
	}
	draw(){
		if(open == this.id){
		ctx.beginPath();
		ctx.fillStyle = this.backColor;
		ctx.fillRect(this.x, this.y, this.width, this.height);
			
		ctx.fillStyle = this.color;
		for(var i = 1; i < 10; i++){
			ctx.fillRect(this.x + (i * (this.width/10)), this.y, 3, this.height);
		}
		if(isDragging){
			this.arc_x = mouse_x;
		}
		ctx.fillStyle = this.arcColor;
		ctx.arc(this.arc_x, this.y + (this.height / 2), (this.height/2 + 4), 0, 2 * Math.PI);
		ctx.fill();
	}
	}
	hovered() {
    	if (this.id == open) {
      		arcHovered = false;
      	    if(Math.pow((mouse_x - this.arc_x), 2) + Math.pow((mouse_y - (this.y + (this.height / 2))), 2) <= Math.pow((this.height/2 + 4	), 2)) {
				arcHovered = true;
			}
		}
	}

		
}

function MouseDown(e){
	  mouse_x = e.clientX - rect.left;
  	  mouse_y = e.clientY - rect.top;
	  if(arcHovered){
	  	isDragging = true;
	  }
}

function MouseUp(e){
	  mouse_x = e.clientX - rect.left;
  	  mouse_y = e.clientY - rect.top;
	  isDragging = false;
}

window.addEventListener("mousedown", MouseDown);
window.addEventListener("mouseup", MouseUp);

class checkBox extends Component{
	constructor(id, x, y, name, color, backColor, width){
		super(id, x, y, name, color, backColor, width);
	}
}