// script.js - Fluffi Presale & Staking Logic

let userAddress = null;

// Wallet connect simulation
async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      document.getElementById('walletAddress').textContent = userAddress;
    } catch (error) {
      alert('Wallet connection failed.');
    }
  } else {
    alert('MetaMask is not installed.');
  }
}

// Presale logic simulation
function buyTokens() {
  if (!userAddress) {
    alert('Please connect your wallet first.');
    return;
  }
  alert('Purchase submitted! (Simulated)');
  updatePresaleProgress();
}

let currentProgress = 0;
function updatePresaleProgress() {
  if (currentProgress < 100) {
    currentProgress += 5;
    document.getElementById('progressBar').style.width = currentProgress + '%';
  }
}

// Staking simulation
function stakeTokens() {
  if (!userAddress) {
    alert('Please connect your wallet first.');
    return;
  }
  alert('Stake successful! (Simulated)');
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Timer for presale stage
function startCountdown(endDateStr, elementId) {
  const endDate = new Date(endDateStr).getTime();
  const timerElement = document.getElementById(elementId);

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = endDate - now;

    if (distance < 0) {
      clearInterval(interval);
      timerElement.textContent = 'Stage Ended';
      return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  const stageEnd = new Date();
  stageEnd.setHours(stageEnd.getHours() + 24);
  startCountdown(stageEnd.toISOString(), 'stageCountdown');
});
