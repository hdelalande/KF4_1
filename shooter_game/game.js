const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

document.body.style.backgroundImage = "url('wallpaper.jpg')";


let timeToNextTarget = 0;
let targetTimeInterval = 100;
let lastTime = 0;

let targets = [];

const listImages = [
    'free-colorful-balloons/1.png',
    'free-colorful-balloons/2.png',
    'free-colorful-balloons/3.png',
    'free-colorful-balloons/4.png'
];

class Target{
    constructor(){
        this.spriteWidth = 300;
        this.spriteHeight = 410;
        this.sizeModifier = Math.random() * 0.1 + 0.25;
        this.width = this.spriteWidth *  this.sizeModifier;
        this.height = this.spriteHeight *  this.sizeModifier;
        this.sizeStart = Math.random();
        if (this.sizeStart > 0.5){
            this.x = canvas.width;
            this.directionX = Math.random() * 1 + 2.5;
        }
        else{
            this.x = 0;
            this.directionX = -(Math.random() * 1 + 2.5);
        }
        this.y = Math.random() * (canvas.height - this.height);
        
        this.directionY = Math.random() * 2 - 0.5;
        this.MarkedForDeletion = false;
        this.test = Math.random();
        this.image = new Image();
        if (this.test > 0.5){
            this.image.src = listImages[1];
        }
        else {
            this.image.src = listImages[2];
        } 
        this.randomColors = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
        this.color = 'rgb('+ this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';



    }
    update(deltatime){
        if (this.y < 0 || this.y > canvas.height - this.height){
            this.directionY = -this.directionY;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) this.MarkedForDeletion = true;
    }

    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

let explosions = [];
class Explosion{
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.timeSinceLastFrame = 0;
        this.frameInterval = 100;
        this.MarkedForDeletion = false;
   }
   update(deltatime){
        console.log(this.timeSinceLastFrame);
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.MarkedForDeletion = true;
        }
   }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size, this.size);
    }
}

window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    targets.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && pc[0] && object.randomColors[2] === pc[2]){
            object.MarkedForDeletion = true;
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    })
});


function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextTarget += deltatime;
    if (timeToNextTarget > targetTimeInterval){
        targets.push(new Target());
        timeToNextTarget = 0;
        targets.sort(function(a,b){
            return a.width - b.width;
        });
    };
    [...targets, ...explosions].forEach(object => object.update(deltatime));
    [...targets, ...explosions].forEach(object => object.draw());
    targets = targets.filter(object => !object.MarkedForDeletion);
    explosions = explosions.filter(object => !object.MarkedForDeletion);
    requestAnimationFrame(animate);
}

var audio = new Audio('audio/Target_practice_1_80-80-0-120-0-120.mp3');
audio.play();
animate(0);