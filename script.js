// Connect Wallet
const connectButton = document.getElementById('connectButton');

connectButton.addEventListener('click', async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      connectButton.innerText = 'Wallet Connected';
      connectButton.disabled = true;
    } catch (error) {
      console.error('User rejected connection');
    }
  } else {
    alert('Please install MetaMask!');
  }
});

// Copy Wallet Address
function copyWallet() {
  const wallet = document.getElementById('wallet');
  wallet.select();
  wallet.setSelectionRange(0, 99999); // For mobile devices
  navigator.clipboard.writeText(wallet.value);
  alert("Wallet Address Copied!");
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.querySelector('footer').classList.toggle('dark-mode');
  document.querySelector('header').classList.toggle('dark-mode');
});

// BNB Raised Counter (Fake animation for now)
let bnbRaised = 800; // Example: 800 BNB raised
document.getElementById('bnbRaised').innerText = `BNB Raised: ${bnbRaised}`;

// Update Progress Bar
function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  const percentage = (bnbRaised / 1600) * 100; // Example: target 1600 BNB
  progressBar.style.width = `${percentage}%`;
  progressBar.innerText = `${Math.floor(percentage)}%`;
}
updateProgressBar();

// Confetti Celebration
const canvas = document.getElementById('confettiCanvas');
const confetti = canvas.getContext('2d');

function startConfetti() {
  const pieces = [];
  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 2,
      speedX: Math.random() * 3 - 1.5,
      speedY: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }

  function update() {
    confetti.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pieces) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y > window.innerHeight) {
        p.y = -10;
        p.x = Math.random() * window.innerWidth;
      }
      confetti.fillStyle = p.color;
      confetti.fillRect(p.x, p.y, p.size, p.size);
    }
    requestAnimationFrame(update);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  update();
}

window.onload = startConfetti;
const ctx = document.getElementById('tokenChart').getContext('2d');
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Presale - 40%', 'Liquidity - 30%', 'Marketing - 15%', 'Team - 10%', 'Reserve - 5%'],
    datasets: [{
      data: [40, 30, 15, 10, 5],
      backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true
  }
});
