function csvToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  
    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });

    return arr;
  }

async function downloadFile(file) {
	let response = await fetch(file);
		
	if(response.status != 200) {
		throw new Error("Server Error");
	}
		
	// read response stream as text
	let text_data = await response.text();

	return text_data;
}

function sendData(data) {
    var XHR = new XMLHttpRequest();
    var FD  = new FormData();
  
    // Mettez les données dans l'objet FormData
    for(name in data) {
      FD.append(name, data[name]);
    }
  
    // Configurez la requête
    XHR.open('POST', 'send_file.php');
  
    // Expédiez l'objet FormData ; les en-têtes HTTP sont automatiquement définies
    XHR.send(FD);
  }



function final(){
    window.removeEventListener('click', function(e){
        if (music_timer < experience_duration){
    
            if (playing == false){
                playing = true;
                document.getElementById(sound_name).play();
            }
            else{
                const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
        
        
                let good_click = false;
                const pc = detectPixelColor.data;
                targets.forEach(object => {
                    if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && pc[0] && object.randomColors[2] === pc[2]){
                        object.MarkedForDeletion = true;
                        explosions.push(new Explosion(object.x, object.y, object.width));
                        good_click = true;
                        }
                    })
                    if (csv_array[step]){
                        number_of_click =+ 1;            
                        let latence = Math.min(music_timer % (1/((csv_array[step]["tempo"]/60)/1000)),(1/((csv_array[step]["tempo"]/60)/1000)-(music_timer % (1/((csv_array[step]["tempo"]/60)/1000)))));
                        result += id +","+music_timer+","+latence+","+csv_array[step]["tempo"] +","+csv_array[step]["structure"]+","+number_of_click+","+good_click+","+sound_name+"\n";
                    }
            }}});
    document.getElementById("canvas1").style.display = "none";
    document.getElementById("collisionCanvas").style.display = "none";
    document.getElementById("final").style.display = "block";
}

function send_final(){
    var age = document.getElementById("age");
    var age_value = age.value;
    var gender = document.getElementById("gender");
    var gender_value = gender.value;
    final_response["data"] = id + "," + sound_name + "," + gender_value + "," + age_value +"\n";
    sendData(final_response);
    document.getElementById("final").style.display = "none";
    // location.href = '';
}
  

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;
const form_final = document.getElementById('final');
form_final.style.display = 'none';

document.body.style.backgroundImage = "url('wallpaper.jpg')";


let timeToNextTarget = 0;
let targetTimeInterval = 100;
let lastTime = 0;
let playing = false;
let sound_name;
let selected_file;
let music_timer = 0;
let experience_duration = 359000;
let sending_timer = 5000;
let step_time = 60000;
let step = 0;
let number_of_click = 0;

let id = Date.now();
let result;

let final_response ={
    "filename":"data/experiences/finished.csv",
    "data":""
}
let response = {
    "filename":"data/experiences/results.csv",
    "data":""
}

let targets = [];

const chart_csv = [
    "data/csv_chart/audio1.csv",
    "data/csv_chart/audio2.csv",
    "data/csv_chart/audio3.csv",
    "data/csv_chart/audio4.csv"
];

const listImages = [
    'free-colorful-balloons/1.png',
    'free-colorful-balloons/2.png',
    'free-colorful-balloons/3.png',
    'free-colorful-balloons/4.png'
];
  

class Button{
    constructor(){
        this.spriteWidth = 352;
        this.spriteHeight = 352;
        this.sizeModifier = 1;
        this.width = this.spriteWidth *  this.sizeModifier;
        this.height = this.spriteHeight *  this.sizeModifier;
        this.x = (canvas.width/2) - this.width/2;
        this.y = (canvas.height/2) - this.height/2;
        this.MarkedForDeletion = false;
        this.image = new Image();
        this.image.src = 'play.png';
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}


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
    if (music_timer < experience_duration){
    
    if (playing == false){
        playing = true;
        document.getElementById(sound_name).play();
    }
    else{
        const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);


        let good_click = false;
        const pc = detectPixelColor.data;
        targets.forEach(object => {
            if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && pc[0] && object.randomColors[2] === pc[2]){
                object.MarkedForDeletion = true;
                explosions.push(new Explosion(object.x, object.y, object.width));
                good_click = true;
                }
            })
            if (csv_array[step]){
                number_of_click =+ 1;            
                let latence = Math.min(music_timer % (1/((csv_array[step]["tempo"]/60)/1000)),(1/((csv_array[step]["tempo"]/60)/1000)-(music_timer % (1/((csv_array[step]["tempo"]/60)/1000)))));
                result += id +","+music_timer+","+latence+","+csv_array[step]["tempo"] +","+csv_array[step]["structure"]+","+number_of_click+","+good_click+","+sound_name+"\n";
            }
    }}});



function animate(timestamp){
    if (music_timer > (experience_duration)){
        console.log(music_timer);
        console.log(experience_duration);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
        final();
    }
    else{
        if (sending_timer < 0){
            if (result){            
                response['data'] = result;
                sendData(response);
                sending_timer = 5000;
                result = "";
                response['data'] = "";
            }
        }
        if (step_time < 0){
            step += 1;
            step_time = 60000 + step_time;
        }
    
        if (playing == true){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
            let deltatime = timestamp - lastTime;
            music_timer = music_timer + deltatime;
            sending_timer = sending_timer - deltatime;
            step_time = step_time - deltatime;
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
        else{
            lastTime = timestamp;
            button.draw();
            requestAnimationFrame(animate);
        }
    }
}


// const readerStructSound = new FileReader();
let random_audio = Math.random() * (chart_csv.length);
if (random_audio < 1){
    sound_name = "audio1";
    sound_structure = chart_csv[0];
}
if (1 <= random_audio && random_audio < 2){
    sound_name = "audio2";
    sound_structure = chart_csv[1];
}
if (2 <=  random_audio && random_audio < 3){
    sound_name = "audio3";
    sound_structure = chart_csv[2];
}
if (3 <= random_audio ){
    sound_name = "audio4";
    sound_structure = chart_csv[3];
}

let button;
let csv_array;
let text_data = downloadFile(chart_csv[0]);


text_data.then( response => {
    csv_array = csvToArray(response);
    button = new Button();
    animate(0);
})


