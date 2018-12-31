//Menu Library for Javascript (canvas)
//N0il

var mouse_x = 0, mouse_y = 0;
var mouse_x2 = 0, mouse_y2 = 0;  //associate the different events to the each var's, 
var mouse_x3 = 0, mouse_y3 = 0;
var open = 0, components = [], pages = [];
var values = [], isWriting = [];
var fullName = [], textX, textY;
var currentComp = 0, currentPerc = 0;
var isDragging = [], arcHovered = [];
var mouseDown = false, nClicked = [];
var notYet = true;

//to prevent errors from events and to be more aesthetic
var noMargin = document.createElement('style');  
noMargin.innerHTML = "html, body {margin: 0; padding: 0; overflow: hidden;}";
document.body.appendChild(noMargin);

var canv = document.getElementById("menuCanvas");
var rect = canv.getBoundingClientRect();
ctx = document.querySelector("canvas").getContext("2d");

function fullWindow() {
  var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;  //cross-browser solution
  var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  ctx.canvas.height = h;
  ctx.canvas.width = w;
}

function createComponents() {
  for (var page of pages) {
    if (open == page.id) {
      page.draw();
    }
  }
  for (var component of components) {
    component.hovered();
    component.draw();
  }
}

class Page {
  constructor(fWindow, id, backColor, width, height) {
    this.id = id;
    this.backColor = backColor;
    this.fWindow = fWindow;
    this.width = width;
    this.height = height;
    if (this.fWindow) {
      fullWindow();
    }
	else{
		ctx.canvas.height = this.height;
  		ctx.canvas.width = this.width;
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
  constructor(id, x, y, name, color, backColor, width) {
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
  clicked() {}
}

class Button extends Component {
  constructor(id, x, y, name, clickedFunction, threeD = false, color = "#FFFFFF", backColor = "#000000", width = 100, height = 50, hoveredBackColor = "#FFFFFF", hoveredColor = "#000000", fonte = "Arial", fontSize = 15) {
    super(id, x, y, name, color, backColor, width);
    this.height = height;
    this.fontSize = fontSize;
    this.clickedFunction = clickedFunction;
	this.threeD = threeD;
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
		if(this.threeD){
			var grd1 = ctx.createLinearGradient(this.x, this.y + this.height, this.x, this.y);
			grd1.addColorStop(0, this.backColor);
			grd1.addColorStop(1,"#FFFFFF");

			var grd2 = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
			grd2.addColorStop(0, this.backColor);
			grd2.addColorStop(1,"#FFFFFF");
		}
      ctx.beginPath();
      if (this.hovered() && !this.threeD) {
        ctx.fillStyle = this.hoveredBackColor;
      } if(!this.hovered() && !this.threeD){
        ctx.fillStyle = this.backColor;
      }
	  if (this.hovered() && this.threeD) {
        ctx.fillStyle = grd2;
      } if(!this.hovered() && this.threeD){
        ctx.fillStyle = grd1;
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
      ctx.fillText(this.name, textX, textY, this.width);  //final parameter not correct
    }
  }
}

class inputText extends Component {
  constructor(id, componentID, x, y, name = "Input text here...", color = "#696969", backColor = "#FFFFFF", width = 180) {
    super(id, x, y, name, color, backColor, width);
    this.height = 26;
    this.fontSize = 13;
    this.font = this.fontSize + "px " + "Arial";
    this.border = 1.5;
    this.componentID = componentID;
    this.defaultName = name;
  }
	
  draw() {
    if (this.id == open) {
      if (this.hovered()) {
        ctx.fillStyle = "#0000FF";
      } else {
        ctx.fillStyle = "#000000";
      }
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.backColor;
      ctx.fillRect(this.x + this.border, this.y + this.border, this.width - this.border * 2, this.height - this.border * 2);
      if (isWriting[this.componentID]) {
        this.color = "#000000";
        this.name = values[this.componentID];
      }
      var textWidth = ctx.measureText(this.name).width;
      ctx.fillStyle = this.color;
      ctx.font = this.font;
      textX = this.x + this.border + 4;
      textY = this.y + this.height / 2 + this.fontSize / 2 - this.border;
      if (currentComp == this.componentID) {  //to prevent writing in both at same time
        if (textWidth <= this.width - 10) {
          ctx.fillText(this.name, textX, textY);
          fullName[this.componentID] = this.name;
        } else {
          isWriting[this.componentID] = false;
          ctx.fillText(fullName[this.componentID], textX, textY);
        }
      } else {
        isWriting[this.componentID] = false;
        ctx.fillText(fullName[this.componentID], textX, textY);
      }
      if ((!isWriting[this.componentID] && values[this.componentID] == "") || values[this.componentID] == undefined) {
        fullName[this.componentID] = "";
        this.color = "#696969";
        ctx.fillText(this.defaultName, textX, textY);
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
        isWriting[this.componentID] = false;
      }
      if (clicked) {
        currentComp = this.componentID;
        if (values[currentComp] == undefined) {
          values[currentComp] = "";
        }
        isWriting[this.componentID] = true;
        specialKeys();
        writing();
      }
    }
  }
}

class percentageBar extends Component {
  constructor(id, componentID, x, y, threeD = false, name = "Percentage Bar", perc = 0, color = "#FFFFFF", backColor = "#12917e", width = 180, height = 15, arcColor = "#121e91", fontSize = 15) {
    super(id, x, y, name, color, backColor, width);
	this.threeD = threeD;
    this.perc = perc;
    this.componentID = componentID;
    this.width = width;
    this.height = height;
    this.arcColor = arcColor;
    this.fontSize = fontSize;
    this.font = this.fontSize + "px " + "Arial";
    this.arc_x = (this.perc * this.width) / 100 + this.x;  //converts percentage into coords (x)
  }
	
  draw() {
    if (open == this.id) {
		if(this.threeD){
			var grd = ctx.createLinearGradient(this.x + this.width, this.y, this.x, this.y);
			grd.addColorStop(0, this.backColor);
			grd.addColorStop(1,"#e0e0d2");
			ctx.fillStyle = grd;
		}
		else{
			 ctx.fillStyle = this.backColor;
		}
      ctx.beginPath();
      ctx.fillRect(this.x, this.y, this.width, this.height);

      ctx.fillStyle = this.color;
      for (var i = 1; i < 10; i++) {
        ctx.fillRect(this.x + i * (this.width / 10), this.y, 3, this.height);
      }
      if (this.arc_x < this.x) {  //setting limits
        this.arc_x = this.x;
		  isDragging[this.componentID] = false;
      }
      if (this.arc_x > this.x + this.width) {
        this.arc_x = this.x + this.width;
		  isDragging[this.componentID] = false;
      }
      if (isDragging[this.componentID]) {
        this.arc_x = mouse_x;
        this.perc = ((this.arc_x - this.x) * 100) / this.width;  //calculates percentage in function of width
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        var textWidth = ctx.measureText(this.name).width;
        ctx.fillText(parseInt(this.perc) + " %", this.x + this.width / 2 - 10, this.y - this.fontSize + 5);
      }
      ctx.fillStyle = this.arcColor;
      ctx.arc(this.arc_x, this.y + this.height / 2, this.height / 2 + 4, 0, 2 * Math.PI);
      ctx.fill();
      if (!isDragging[this.componentID]) {
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        var textWidth = ctx.measureText(this.name).width;
        ctx.fillText(this.name, this.x + this.width / 2 - textWidth / 2, this.y - this.fontSize + 5);
      }
    }
  }
	
  hovered() {
    if (this.id == open) {
      arcHovered[this.componentID] = false;
      if (Math.pow(mouse_x - this.arc_x, 2) + Math.pow(mouse_y - (this.y + this.height / 2), 2) <= Math.pow(this.height / 2 + 4, 2)) {
        arcHovered[this.componentID] = true;  //check if mouse is in circle or not
      }
      if (arcHovered[this.componentID] && mouseDown) {
        currentPerc = this.componentID;
		isDragging[this.componentID] = true;
      }
    }
  }
}

class checkBox extends Component {
  constructor(id, componentID, x, y, multi = false, n = 4, name = "Check Boxes", color = "#000000", backColor = "#FFFFFF", width = 20, titleColor = "#000000", textColor = "#000000", type = "rect", font = "Arial", fontSize = 15) {
    super(id, x, y, name, color, backColor, width);
	  this.n = n;
	  this.componentID = componentID;
	  this.multi = multi;
	  this.textColor = textColor;
	  this.titleColor = titleColor;
	  this.type = type;
	  this.fontSize = fontSize;
	  this.font = this.fontSize + "px " + font;
	  this.border = 1.5;
	  this.phrases = [];
	  this.multiCheck = [];
	  if(this.multi){
	  	nClicked[this.componentID] = this.multiCheck;
	  }
  }
	
	draw(){
		if(open == this.id){
			ctx.fillStyle = this.textColor;
			ctx.font = this.font;
			ctx.fillText(this.name, this.x, this.y);
			if(this.type == "rect"){
				for(var i = 1; i <= this.n; i++){
					ctx.fillStyle = this.color;
					ctx.fillRect(this.x, (this.y) + (this.width + 5) * i, this.width, this.width);
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect(this.x + this.border, (this.y) + (this.width + 5) * i + this.border, this.width - this.border * 2, this.width - this.border * 2);
					if(!this.multi && nClicked[this.componentID] == i){
						ctx.fillStyle = this.color;
						ctx.fillRect(this.x + this.border + 2, (this.y) + (this.width + 5) * i + this.border + 2, this.width - this.border * 2 - 4, this.width - this.border * 2 - 4);
					}
					if(this.multi){
						if(this.multiCheck[i]){
							ctx.fillStyle = this.color;
							ctx.fillRect(this.x + this.border + 2, (this.y) + (this.width + 5) * i + this.border + 2, this.width - this.border * 2 - 4, this.width - this.border * 2 - 4);
						}
					}
				}
				ctx.fillStyle = this.titleColor;
			    for(var i = 1; i <= this.n; i++){
					ctx.fillText(this.phrases[i-1], this.x + this.width + 10, (this.y) + (this.width + 5) * i + (this.width / 2) + (this.width / 4));
				}
		    }
			if(this.type == "circle"){
				for(var i = 1; i <= this.n; i++){
					ctx.beginPath();
					ctx.fillStyle = this.color;
				    ctx.arc(this.x, (this.y) + (this.width + 5) * i, this.width / 2, 0, 2 * Math.PI);
					ctx.fill();
					ctx.beginPath();
					ctx.fillStyle = "#FFFFFF";
					ctx.arc(this.x, (this.y) + (this.width + 5) * i, this.width / 2 - this.border, 0, 2 * Math.PI);
                    ctx.fill();
					if(!this.multi && nClicked[this.componentID] == i){
						ctx.beginPath();
						ctx.fillStyle = this.color;
						ctx.arc(this.x, (this.y) + (this.width + 5) * i, this.width / 2 - this.border - 2, 0, 2 * Math.PI);
                    	ctx.fill();
					}
						if(this.multi){
							if(this.multiCheck[i]){
								ctx.beginPath();
								ctx.fillStyle = this.color;
								ctx.arc(this.x, (this.y) + (this.width + 5) * i, this.width / 2 - this.border - 2, 0, 2 * Math.PI);
                    			ctx.fill();
							}
					}
				}
				ctx.fillStyle = this.titleColor;
			    for(var i = 1; i <= this.n; i++){
					ctx.fillText(this.phrases[i-1], this.x + this.width + 5, (this.y) + (this.width + 5) * i + (this.width / 2) - (this.width / 4));
				}
			}
		}
	}
	
	 clicked() {
    	if (this.id == open) {
			if(this.type == "rect"){
				for(var i = 1; i <= this.n; i++){
    				var left = this.x;
					var right = this.x + this.width;
    				var top = ((this.y) + (this.width + 5) * i);
    				var bottom = ((this.y) + (this.width + 5) * i) + this.width;
					var clicked = true;
      				if (bottom < mouse_y2 || top > mouse_y2 || right < mouse_x2 || left > mouse_x2) {
       					clicked = false;
					}
      				if (clicked) {
						if(!this.multi){
							nClicked[this.componentID] = i;
						}
						else if(this.multi && !this.multiCheck[i]){
							this.multiCheck[i] = true;
						}
					    else if(this.multi && this.multiCheck[i]){
							this.multiCheck[i] = false;
						}
      				}
				}
			}
			if(this.type == "circle"){
				for(var i = 1; i <= this.n; i++){
					var clicked2 = false;
      				if (Math.pow(mouse_x2 - this.x, 2) + Math.pow(mouse_y2 - ((this.y) + (this.width + 5) * i), 2) <= Math.pow(this.width / 2, 2)) {
        				clicked2 = true;  
      				}
				if(clicked2){
					console.log("clicked in " +i);
						if(!this.multi){
							nClicked[this.componentID] = i;
						}
						else if(this.multi && !this.multiCheck[i]){
							this.multiCheck[i] = true;
						}
					    else if(this.multi && this.multiCheck[i]){
							this.multiCheck[i] = false;
						}
				}
				}
			}
  		}
	 }
}

class dropDownList extends Component{
	constructor(id, x, y, name = "Drop Down List", n = 4, color = "#000000", hoveredColor = "#00D0FF", backColor = "#FFFFFF", width = 150, secColor = "#000000", secBackColor = "#FFFFFF", secBackHoveredColor = "#0FED0E", font = "Arial"){
		super(id, x, y, name, color, backColor, width);
		this.n = n;
		this.height = 26;
		this.hoveredColor = hoveredColor;
		this.secColor = secColor;
		this.secBackColor = secBackColor;
		this.secBackHoveredColor = secBackHoveredColor;
		this.border = 3;
		this.font = this.fontSize + "px " + font;
		this.fontSize = 13;
		this.phrases = [];
		this.current = 0;
	}
	
	draw(){
		if(open == this.id){
			if (this.hovered()) {
        		ctx.fillStyle = this.hoveredColor;
      		} else {
        		ctx.fillStyle = this.color;
      		}
			ctx.fillRect(this.x, this.y, this.width, this.height);
      		ctx.fillStyle = this.backColor;
      		ctx.fillRect(this.x + this.border, this.y + this.border, this.width - this.border * 2, this.height - this.border * 2);
			ctx.fillStyle = this.color;
        	ctx.font = this.font;
        	var textWidth = ctx.measureText(this.name).width;
        	ctx.fillText(this.name, this.x + this.width / 2 - textWidth / 2, this.y - this.fontSize + 5);
			if(!this.clicked() && this.current == 0){
				this.phrases[0] = "Click here!";
				ctx.fillStyle = "#696969";
				var textWidth = ctx.measureText(this.phrases[0]).width;
				ctx.fillText(this.phrases[0], this.x + this.width / 2 - textWidth / 2, this.y + this.fontSize + 5);
			}
			else if(this.clicked()){
				ctx.fillStyle = "#696969";
				this.phrases[0] = "Click below!";
				var textWidth = ctx.measureText(this.phrases[0]).width;
				ctx.fillText(this.phrases[0], this.x + this.width / 2 - textWidth / 2, this.y + this.fontSize + 5);
				
				for(var i = 1; i <= this.n; i++){
					var left = this.x;
    				var right = this.x + this.width;
    				var top = (this.y + (this.height * i) + this.border*(i-1));
    				var bottom = (this.y + (this.height * i) + this.border*(i-1)) + this.height;
					var clicked2 = true;
      				if (bottom < mouse_y3 || top > mouse_y3 || right < mouse_x3 || left > mouse_x3) {
       					clicked2 = false;
					}
					if(clicked2){
						this.current = i;
					}
					var hovered2 = true;
      				if (bottom < mouse_y || top > mouse_y || right < mouse_x || left > mouse_x) {
       					hovered2 = false;
					}
					if(hovered2){
						ctx.fillStyle = this.secBackHoveredColor;
					}
					else{
						ctx.fillStyle = this.secBackColor;
					}
					ctx.fillRect(this.x, this.y + (this.height * i) + this.border*(i-1), this.width, this.height);
					ctx.fillStyle = this.secColor;
					var textWidth = ctx.measureText(this.phrases[i]).width;
					ctx.fillText(this.phrases[i], this.x + this.width / 2 - textWidth / 2, (this.y + this.fontSize + 5) + (this.height * i) + this.border*(i-1));
				}
			}
			else{
			var textWidth = ctx.measureText(this.phrases[this.current]).width;
			ctx.fillText(this.phrases[this.current], this.x + this.width / 2 - textWidth / 2, this.y + this.fontSize + 5);
			}
		}
	}
	
	clicked(){
		if(open == this.id){
    		var left = this.x;
    		var right = this.x + this.width;
    		var top = this.y;
    		var bottom = this.y + this.height;
			var clicked = true;
      			if (bottom < mouse_y2 || top > mouse_y2 || right < mouse_x2 || left > mouse_x2) {
       				clicked = false;
				}
				return clicked;
		}
	}
}

//Handling and listening to events
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

function MouseDown(e) {
  mouseDown = true;
  mouse_x3 = e.clientX - rect.left;
  mouse_y3 = e.clientY - rect.top;
}

function MouseUp(e) {
  mouseDown = false;
  isDragging[currentPerc] = false;
}

function specialKeys(event) {  //because keypress doesn't listen to special keys
  var key = event.which || event.keyCode;  //cross-browser solution
  if (key == 13) {
    isWriting[currentComp] = false;
    return values[currentComp];
  }
  if (key == 8 || key == 46) {
    isWriting[currentComp] = true;
    values[currentComp] = values[currentComp].slice(0, values[currentComp].length - 1);
  }
}

function writing(e) {  //because keydown doesn't listen to all char's
  if (isWriting[currentComp]) {
    var key = e.which || e.keyCode;
    values[currentComp] = values[currentComp] + String.fromCharCode(key);
  }
}

window.addEventListener("mousemove", getCoords);
window.addEventListener("click", Click);
window.addEventListener("mousedown", MouseDown);
window.addEventListener("mouseup", MouseUp);
window.addEventListener("keypress", writing);
window.addEventListener("keydown", specialKeys);
