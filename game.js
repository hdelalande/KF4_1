var w = window.innerWidth;
var h = window.innerHeight; 
var box;

if (w > 900 && h > 600){
    var canvas_Width = 900;
    var canvas_Height = 600;
}

if (w < 900 || h < 600){
    var canvas_Width = w - 50;
    var canvas_Height = h - 50;
}



function startGame(){
    gameCanvas.start();
    box = new displayBox(30, canvas_Width/40, canvas_Height/40);
}

var gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = canvas_Width;
        this.canvas.height = canvas_Height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}

function displayBox(nbBoxs, width, height){
    var checkBox = [];
    var i = 0;
    while(i<nbBoxs){
        this.height = height;
        this.width = width;
        this.x = Math.random()*(canvas_Width - 2*this.width) + this.width;
        this.y = Math.random()*(canvas_Height- 2*this.height) + this.height;
        
        id_x = Math.floor(this.x / (this.width));
        id_y = Math.floor(this.y / (this.height));

        if (!(checkBox.includes((id_x, id_y)))){
            checkBox.push((id_x, id_y));
            ctx = gameCanvas.context;
            ctx.fillStyle = "green";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.onclick = function(){
                var element = this.id;
                //I have also tried using document.getElementByID(this.id)
                element.remove();
                //I have also tried using element.parentNode.removeChild(element); to remove the element.
            }
            i++;
        }
    }
}
