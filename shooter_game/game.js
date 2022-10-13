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
let targetTimeInterval = 500;
let lastTime = 0;

let targets = [];

const listImages = [
    'bee/sprites/skeleton-animation_00.png',
    'bee/sprites/skeleton-animation_01.png',
    'bee/sprites/skeleton-animation_02.png',
    'bee/sprites/skeleton-animation_03.png',
    'bee/sprites/skeleton-animation_04.png',
    'bee/sprites/skeleton-animation_05.png',
    'bee/sprites/skeleton-animation_06.png',
    'bee/sprites/skeleton-animation_07.png',
    'bee/sprites/skeleton-animation_08.png',
    'bee/sprites/skeleton-animation_09.png',
    'bee/sprites/skeleton-animation_10.png',
    'bee/sprites/skeleton-animation_11.png',
    'bee/sprites/skeleton-animation_12.png'
];

class Target{
    constructor(){
        this.spriteWidth = 273;
        this.spriteHeight = 282;
        this.sizeModifier = Math.random() * 0.1 + 0.35;
        this.width = this.spriteWidth *  this.sizeModifier;
        this.height = this.spriteHeight *  this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.MarkedForDeletion = false;
        this.images = [];
        for (let i=0 ; i < listImages.length ; i++){
            this.images.push(new Image());
            this.images[i].src = listImages[i];
        };
        this.frame = 0;
        this.maxFrame = 5;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 60 + 20;
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
        this.timeSinceFlap += deltatime;
        if (this.timeSinceFlap > this.flapInterval){
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
        }
    }
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.images[this.frame], this.x, this.y, this.width, this.height);
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

animate(0);