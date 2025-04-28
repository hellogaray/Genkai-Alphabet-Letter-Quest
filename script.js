// Get DOM elements
const canvas = document.getElementById('myCanvas');
const playBtn = document.getElementById('playBtn');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const finishBtn = document.getElementById('finishBtn');
const scoreDiv = document.getElementById('score');
const example = document.getElementById('example');

// Set up the 2D drawing context for the canvas
const ctx = canvas.getContext('2d');

// Generate the alphabet (A-Z)
const alphabet = Array.from(Array(26)).map((_, i) => String.fromCharCode(65 + i));

// Initialize variables
let drawing = false;
let item = NaN;
let finalScore = 0;
let count = 0;
let img = document.createElement("img");

// Event listeners for drawing
canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});
canvas.addEventListener('mousemove', (event) => {
    if (!drawing) return;

    ctx.lineWidth = 50;
    ctx.lineCap = 'round';

    const pixel = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
    const [r, g, b, a] = pixel;
    const isGray = (r === 150 && g === 150 && b === 150 && a === 255);
    const isWhite = (r === 255 && g === 255 && b === 255 && a === 255);

    if (isGray) {
        ctx.strokeStyle = 'black';
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    } else if (isWhite) {
        ctx.strokeStyle = 'red';
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    }
});

// Function to draw the letter
function drawLetter(letter) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "500px Arial";
    ctx.fillStyle = 'rgb(150, 150, 150)';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2);
}


// Play button functionality
playBtn.addEventListener('click', function() {
    item = alphabet[Math.floor(Math.random() * alphabet.length)];
    drawLetter(item);

    img.src = `./images/${item}.png`;
    example.appendChild(img);
});

// Submit button functionality
submitBtn.addEventListener('click', function() {
    const counts = { red: 0, gray: 0, black: 0 };
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
        if (a !== 255) continue;
        if (r === 255 && g === 0 && b === 0) counts.red++;
        else if (r === 150 && g === 150 && b === 150) counts.gray++;
        else if (r === 0 && g === 0 && b === 0) counts.black++;
    }

    const results = Math.round(((counts.black / (counts.black + counts.red + counts.gray)) * 100));
    finalScore += results;
    count++;

    if (results >= 90) scoreDiv.innerHTML = 'Perfect';
    else if (results < 90 && results > 70) scoreDiv.innerHTML = 'Great Job';
    else if (results < 70 && results > 50) scoreDiv.innerHTML = 'Good Job';
    else scoreDiv.innerHTML = 'You failed';

    console.log(results);
});

// Clear button functionality
clearBtn.addEventListener('click', function() {
    drawLetter(item);
});

// Finish button functionality
finishBtn.addEventListener('click', function() {
    finalScore = finalScore / count;
    console.log(`Final Score: ${finalScore}`);
});
