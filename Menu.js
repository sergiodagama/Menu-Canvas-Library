//Menu Library for Javascript (canvas)
//N0il
//Note: put script library after <canvas></canvas> and <canvas> id has to be menuCanvas
//Note: cannot pass function to buttons from Menu, like Page.draw
var mouse_x = 0, mouse_y = 0;
var mouse_x2 = 0, mouse_y2 = 0;
var open = 0, components = [], pages = [];
var values = [], isWriting = [];
var fullName = [], textX, textY;
var currentComp = 0, currentPerc = 0;
var isDragging = [], arcHovered = [];
var mouseDown = false;
var canv = document.getElementById("menuCanvas");
var rect = canv.getBoundingClientRect();

ctx = document.querySelector("canvas").getContext("2d");

function fullWindow() {
  var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;  //cross-browser solution
  var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  ctx.canvas.height = h;
  ctx.canvas.width = w;
}

function fullScreen() {
  fullWindow();
  if (canv.requestFullscreen) {
    canv.requestFullscreen();
  } else if (canv.mozRequestFullScreen) {
    /* Firefox */
    canv.mozRequestFullScreen();
  } else if (canv.webkitRequestFullscreen) {
    /* Chrome, Safari & Opera */
    canv.webkitRequestFullscreen();
  } else if (canv.msRequestFullscreen) {
    /* IE/Edge */
    canv.msRequestFullscreen();
  }
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
        if (textWidth <= this.width) {
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
  constructor(id, componentID, x, y, name, perc = 0, color = "#FFFFFF", backColor = "#12917e", width = 180, height = 15, arcColor = "#121e91", fontSize = 15) {
    super(id, x, y, name, color, backColor, width);
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
      ctx.beginPath();
      ctx.fillStyle = this.backColor;
      ctx.fillRect(this.x, this.y, this.width, this.height);

      ctx.fillStyle = this.color;
      for (var i = 1; i < 10; i++) {
        ctx.fillRect(this.x + i * (this.width / 10), this.y, 3, this.height);
      }
      if (this.arc_x < this.x) {  //setting limits
        this.arc_x = this.x;
      }
      if (this.arc_x > this.x + this.width) {
        this.arc_x = this.x + this.width;
      }
      if (isDragging[this.componentID]) {
        this.arc_x = mouse_x;
        this.perc = ((this.arc_x - this.x) * 100) / this.width;  //calculates percentage in function of width
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        var textWidth = ctx.measureText(this.name).width;
        ctx.fillText(
          parseInt(this.perc) + " %", this.x + this.width / 2 - textWidth / 2, this.y - this.fontSize / 2);
      }
      ctx.fillStyle = this.arcColor;
      ctx.arc(this.arc_x, this.y + this.height / 2, this.height / 2 + 4, 0, 2 * Math.PI);
      ctx.fill();
      if (!isDragging[this.componentID]) {
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        var textWidth = ctx.measureText(this.name).width;
        ctx.fillText(this.name, this.x + this.width / 2 - textWidth / 2, this.y - this.fontSize / 2);
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
  constructor(id, x, y, name, color, backColor, width) {
    super(id, x, y, name, color, backColor, width);
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
  mouse_x = e.clientX - rect.left;
  mouse_y = e.clientY - rect.top;
}

function MouseUp(e) {
  mouseDown = false;
  mouse_x = e.clientX - rect.left;
  mouse_y = e.clientY - rect.top;
  isDragging[currentPerc] = false;
}

function specialKeys(event) {  //because keypress doesn't listen to special keys
  var key = event.which || event.keyCode;  //cross-browser solution
  if (key == 13) {
    isWriting[currentComp] = false;
    return values[currentComp];
  }
  if (key == 8) {
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