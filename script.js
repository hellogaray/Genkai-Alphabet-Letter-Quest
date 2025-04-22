// Get DOM elements
const canvas = document.getElementById('myCanvas');
const playBtn = document.getElementById('playBtn');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const finishBtn = document.getElementById('finishBtn');
const scoreDiv = document.getElementById('score');

// Set up the 2D drawing context for the canvas
const ctx = canvas.getContext('2d');

// Generate the alphabet (A-Z) for the game
const alphabet = Array.from(Array(26)).map((_, i) => String.fromCharCode(65 + i));

// Initialize variables
let drawing = false;
let item = NaN;
let finalScore = 0;
let count = 0;

canvas.addEventListener('mousedown', () => {
    drawing = true;
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath(); // Reset path so lines don't connect
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
        ctx.strokeStyle = 'black'; // draw black over gray letter
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    } else if (isWhite) {
        ctx.strokeStyle = 'red'; // draw red over white background
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    } 
});

function drawLetter(letter) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Fill whole background white (pure white)
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "500px Arial";
    ctx.fillStyle = 'rgb(150, 150, 150)'; // specific medium gray
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2);
}

playBtn.addEventListener('click', function() {
    item = alphabet[Math.floor(Math.random() * alphabet.length)];
    drawLetter(item);
});

submitBtn.addEventListener('click', function() {
    const counts = {
        red: 0,
        gray: 0,
        black: 0
      };
      
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
      
        if (a !== 255) continue; // only fully solid pixels
      
        if (r === 255 && g === 0 && b === 0) {
          counts.red++;
        } else if (r === 150 && g === 150 && b === 150) {
          counts.gray++;
        } else if (r === 0 && g === 0 && b === 0) {
          counts.black++;
        }
      }
      
      results = Math.round(((counts.black / (counts.black + counts.red + counts.gray)) * 100))
      finalScore += results;
      count += 1

      if (results >= 90) {
        scoreDiv.innerHTML = 'Perfect'
      } if (results < 90 && results > 70) {
        scoreDiv.innerHTML = 'Great Job'
      } if (results < 70 && results > 50) {
        scoreDiv.innerHTML = 'Good Job'
      } if (results < 50) {
        scoreDiv.innerHTML = 'You failed'
      }

      console.log(results);   
})


clearBtn.addEventListener('click', function() {
    drawLetter(item);
})

finishBtn.addEventListener('click', function() {
    finalScore = finalScore/count
    console.log(`Final Score: ${finalScore}` )
})