/* script.js - Fluffi Wallet + Presale Logic */

// Wallet connect logic
let userWallet = null;
async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userWallet = accounts[0];
      document.getElementById('walletAddress').innerText = userWallet;
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  } else {
    alert('Please install MetaMask!');
  }
}

// Presale logic
const totalTokens = 4000000000;
const stageCount = 15;
const basePrice = 0.0001;
const stageDurationMs = 24 * 60 * 60 * 1000;
let tokensSold = 0;

function getCurrentStage() {
  const presaleStart = new Date("2025-05-05T00:00:00Z").getTime();
  const now = Date.now();
  let stage = Math.floor((now - presaleStart) / stageDurationMs);
  return stage >= stageCount ? stageCount - 1 : stage;
}

function getPriceForStage(stage) {
  return basePrice * Math.pow(1.05, stage);
}

function updatePresaleUI() {
  const stage = getCurrentStage();
  const price = getPriceForStage(stage);
  document.getElementById('currentStage').innerText = stage + 1;
  document.getElementById('tokenPrice').innerText = price.toFixed(6) + ' BNB';

  const percent = Math.min((tokensSold / totalTokens) * 100, 100);
  document.getElementById('progressBar').style.width = percent + '%';
}

function simulateBuyTokens(amountInBNB) {
  const stage = getCurrentStage();
  const price = getPriceForStage(stage);
  const tokens = amountInBNB / price;
  tokensSold += tokens;
  updatePresaleUI();
  alert(`You bought ${tokens.toFixed(0)} FLUFFI tokens!`);
}

// Countdown timer to next stage
function updateCountdown() {
  const now = Date.now();
  const stage = getCurrentStage();
  const nextStage = new Date("2025-05-05T00:00:00Z").getTime() + (stage + 1) * stageDurationMs;
  const remaining = nextStage - now;

  if (remaining > 0) {
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remaining % (1000 * 60)) / 1000);
    document.getElementById('stageTimer').innerText = `${hours}h ${mins}m ${secs}s`;
  } else {
    updatePresaleUI();
  }
}

setInterval(updateCountdown, 1000);
updatePresaleUI();
