// Get DOM elements
const canvas = document.getElementById('myCanvas');
const playBtn = document.getElementById('playBtn');
const clearBtn = document.getElementById('clearBtn');
const finishBtn = document.getElementById('finishBtn');
const scoreDiv = document.getElementById('score');
const dialog = document.getElementById('dialogScore');
const scoreText = document.getElementById('scoreText');
const scoreImage = document.getElementById('scoreImage');
const playAgain = document.getElementById('playAgain');

// Sounds
const clickSound = new Audio('./sound/click.mp3');
const endSound = new Audio('./sound/end.mp3');

// Set up the 2D drawing context for the canvas
const ctx = canvas.getContext('2d');

// Generate the alphabet (A-Z and a-z)
const alphabet = [
    ...Array.from(Array(26), (_, i) => String.fromCharCode(65 + i)),
    ...Array.from(Array(26), (_, i) => String.fromCharCode(97 + i))
];

// Initialize variables
let finalScore = 0;
let count = 0;
let results = 0;
let drawing = false;
let item = alphabet[Math.floor(Math.random() * alphabet.length)];
let img = document.createElement("img");

// Mouse event listeners for drawing
canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
    });

canvas.addEventListener('mouseup', () => {
  drawing = false;
  ctx.beginPath();
});

canvas.addEventListener('mousemove', (event) => {
  if (!drawing) return;

  drawStroke(event.offsetX, event.offsetY);
});

// Touch event listeners for drawing
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    drawing = true;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!drawing) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    drawStroke(x, y);
});

// Common function for drawing stroke based on color detection
function drawStroke(x, y) {
    ctx.lineWidth = 35;
    ctx.lineCap = 'round';

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b, a] = pixel;
    const isBerkeleyBlue = (r === 168 && g === 218 && b === 220 && a === 255);
    const isHoneydew = (r === 241 && g === 250 && b === 238 && a === 255);

    if (isBerkeleyBlue) {
        ctx.strokeStyle = '#1D3557';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if (isHoneydew) {
        ctx.strokeStyle = '#E63946';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
}

// Function to draw the letter
function drawLetter(letter) {
    const img = new Image();
    img.src = (letter.charCodeAt(0) < 97)
      ? `./images/letters/${letter}-Upper.png`
      : `./images/letters/${letter}-Lower.png`;
  
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgb(241, 250, 238)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }
  
function playClickSound() {
    clickSound.play();
}

// Attach click event to all buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', playClickSound);
  });
});

// Play Button functionality
playBtn.addEventListener('click', function () {
  item = alphabet[Math.floor(Math.random() * alphabet.length)];

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

  let feedback = '';
  if (results >= 90) {
      feedback = `
        <div>
          <div class="hanamaru-stamp">💮</div>
          <div><strong>すごい！</strong></div>
        </div>`;
  } else if (results < 90 && results > 70) {
      feedback = `
        <div>
          <div class="hanamaru-stamp">🌼</div>
          <div><strong>いいね！</strong></div>
        </div>`;
  } else if (results <= 70 && results > 50) {
      feedback = `
        <div>
          <div class="hanamaru-stamp">✿</div>
          <div><strong>がんばった！</strong></div>
        </div>`;
  } else {
      feedback = `
        <div>
          <div class="hanamaru-stamp">❌</div>
          <div><strong>もういっかい！</strong></div>
        </div>`;
  }

  // Show feedback
  scoreDiv.innerHTML = feedback;

  // Delay before clearing and drawing new letter
  setTimeout(() => {
      scoreDiv.innerHTML = ''; // Clear previous score
      drawLetter(item);        // Then draw the next letter
      console.log(`Item: ${item} | Score: ${results} | Count: ${count} | Final Result: ${finalScore}`);
  }, 1000); // Adjust the delay time (ms) as needed
});

// Clear button functionality
clearBtn.addEventListener('click', function () {
    drawLetter(item);
});

// Dialog functionality
const showDialog = (show) => {
  if (show) {
    dialog.classList.add('fade-in');
    dialog.showModal();
  } else {
    dialog.close();
  }
};

// Finish button functionality
finishBtn.addEventListener('click', function () {
  if (count === 0) {
      console.warn('Cannot calculate average score: count is zero.');
      return;
  }
  showDialog(true)
  endSound.play();

  const averageScore = Math.round(finalScore / count);
  const resultImg = new Image();
  scoreDiv.innerHTML = ``

  if (averageScore > 69) {
      resultImg.src = `./images/hanamarus/goodHana.png`
  } else if (averageScore < 70 && averageScore > 49 ) {
    resultImg.src = `./images/hanamarus/mehHana.png`
  } else {
      resultImg.src = `./images/hanamarus/sadHana.png`
  }
  scoreImage.replaceChild(resultImg, scoreImage.childNodes[0]);

  scoreText.innerHTML = `
  スコア: ${averageScore}（${count}回チャレンジしたよ！）<br>
  Score: ${averageScore} after ${count} tries!
  `;
  console.log(`Final Score: ${averageScore}`);

  // Reset scores
  results = 0;
  finalScore = 0;
  count = 0;
});

// Close dialog button 
playAgain.addEventListener('click', function() {
  showDialog(false)
})

// Start the first letter
drawLetter(item);

