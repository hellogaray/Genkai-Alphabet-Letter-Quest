// Get DOM elements
const canvas = document.getElementById('myCanvas');
const playBtn = document.getElementById('playBtn');
const clearBtn = document.getElementById('clearBtn');
const finishBtn = document.getElementById('finishBtn');
const scoreDiv = document.getElementById('score');

// Set up the 2D drawing context for the canvas
const ctx = canvas.getContext('2d');

// Generate the alphabet (A-Z)
const alphabet = [
  ...Array.from(Array(26), (_, i) => String.fromCharCode(65 + i)),  // A-Z
  ...Array.from(Array(26), (_, i) => String.fromCharCode(97 + i))   // a-z
];

// Initialize variables
let finalScore = 0;
let count = 0;
let results = 0;
let drawing = false;
let item = alphabet[Math.floor(Math.random() * alphabet.length)];
let img = document.createElement("img");

// Event listeners for drawing
canvas.addEventListener('mousedown', () => drawing = true);

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', (event) => {
    if (!drawing) return;

    ctx.lineWidth = 35;
    ctx.lineCap = 'round';

    const pixel = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
    const [r, g, b, a] = pixel;
    const isBerkeleyBlue = (r === 168 && g === 218 && b === 220 && a === 255);
    const isHoneydew = (r === 241 && g === 250 && b === 238 && a === 255);

    if (isBerkeleyBlue) {
        ctx.strokeStyle = '#1D3557';
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    } else if (isHoneydew) {
        ctx.strokeStyle = '#E63946';
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    }
});

// Function to draw the letter
function drawLetter(letter) {
  const img = new Image();
  // Add -Upper or -Lower depending on charCode.
  if (letter.charCodeAt(0) < 97) { 
    img.src = `./images/${letter}-Upper.png`;
  } else {
    img.src = `./images/${letter}-Lower.png`;
  }

  img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgb(241, 250, 238)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the image, but leave out the last 4px from the bottom
      ctx.drawImage(
          img,
          0, 0, img.width, img.height - 16, // source (cut bottom 4px)
          0, 0, canvas.width, canvas.height - (16 * canvas.height / img.height) // scale accordingly
      );
  };
}

// Play button functionality
playBtn.addEventListener('click', function() {
    item = alphabet[Math.floor(Math.random() * alphabet.length)];
    console.log(item)
    drawLetter(item);

    const counts = { redPantone: 0, nonPhotoBlue: 0, berkeleyBlue: 0 };
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
        if (a !== 255) continue;
        if (r === 230 && g === 57 && b === 70) counts.redPantone++;
        else if (r === 168 && g === 218 && b === 220) counts.nonPhotoBlue++;
        else if (r === 29 && g === 53 && b === 87) counts.berkeleyBlue++;
    }
    count++;
    results = Math.round(((counts.berkeleyBlue / (counts.berkeleyBlue + counts.redPantone + counts.nonPhotoBlue)) * 100));
    finalScore += results;

    if (results >= 90) scoreDiv.innerHTML = 'Perfect';
    else if (results < 90 && results > 70) scoreDiv.innerHTML = 'Great Job';
    else if (results < 70 && results > 50) scoreDiv.innerHTML = 'Good Job';
    else scoreDiv.innerHTML = 'You failed';

    console.log(`Item: ${item} | Score: ${results} | Count:${count} | Final Result: ${finalScore}`);
});

// Clear button functionality
clearBtn.addEventListener('click', function() {
    // Clear the canvas
    drawLetter(item);
});

// Finish button functionality
finishBtn.addEventListener('click', function() {
  if (count === 0) {
      console.warn('Cannot calculate average score: count is zero.');
      return;
  }

  const averageScore = finalScore / count;
  console.log(`Item: ${item} | Score: ${results} | Count: ${count} | Final Result: ${averageScore}`);
  console.log(`Final Score: ${averageScore}`);

  // Reset scores
  results = 0;
  score = 0;
  finalScore = 0;
});

// Start the first letter
drawLetter(item);