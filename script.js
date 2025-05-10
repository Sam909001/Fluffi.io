// --- Referral Tracking ---
const urlParams = new URLSearchParams(window.location.search);
const refWallet = urlParams.get('ref');
if (refWallet) {
  localStorage.setItem('fluffiRef', refWallet);
}

// --- Simulated Leaderboard Data ---
let leaderboard = JSON.parse(localStorage.getItem('fluffiLeaderboard')) || {};

// --- DOMContentLoaded Wrapper ---
document.addEventListener('DOMContentLoaded', () => {
  // --- Buy Function Setup ---
  const stage = 0; // Stage 1 (0-based index)
  const stages = 15; // Total stages
  const price = 0.01; // Example price in USD

  // Update stage and price info
  const stageInfo = document.getElementById('stageInfo');
  const priceInfo = document.getElementById('priceInfo');

  if (stageInfo && priceInfo) {
    stageInfo.textContent = `Stage: ${stage + 1} / ${stages}`;
    priceInfo.textContent = `Price: $${price}`;
  }

  // Handle buy button click
  const amountInput = document.getElementById('amountInput');
  const buyButton = document.getElementById('buyButton');

  if (amountInput && buyButton) {
    buyButton.addEventListener('click', () => {
      const amount = parseFloat(amountInput.value);
      const ref = document.getElementById('refInput')?.value || localStorage.getItem('referrer') || 'none';

      if (!userWalletAddress) {
        alert('Please connect your wallet first.');
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
      }

      if (ref && ref !== userWalletAddress) {
        const reward = amount * 0.10;
        leaderboard[ref] = (leaderboard[ref] || 0) + reward;
        localStorage.setItem('fluffiLeaderboard', JSON.stringify(leaderboard));
        alert(`You are buying $${amount} of FLUFFI. Referrer ${ref} earns $${reward.toFixed(2)} bonus.`);
      } else {
        alert(`You are buying $${amount} of FLUFFI.`);
      }
    });
  } else {
    console.error('❌ amountInput or buyButton not found in the DOM.');
  }

  // --- Render Leaderboard ---
  function renderLeaderboard() {
    const container = document.getElementById('leaderboard');
    container.innerHTML = '<h3 class="text-lg font-bold mb-2">Top Referrers</h3>';
    const sorted = Object.entries(leaderboard)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sorted.length === 0) {
      container.innerHTML += '<p class="text-sm text-gray-500">No referrals yet.</p>';
    } else {
      sorted.forEach(([address, amount], index) => {
        container.innerHTML += `<p class="text-sm">${index + 1}. ${address} - $${amount.toFixed(2)}</p>`;
      });
    }
  }
  renderLeaderboard();

  getReferrerFromURL();
  applyReferralField();
  updateStage();
  updateCountdown();
  setInterval(() => {
    updateStage();
    updateCountdown();
  }, 1000);
});

let userWalletAddress = null;
const initialPrice = 0.0001;
const stages = 15;
const stageDuration = 1000 * 60 * 60 * 48;
const startTime = new Date("2025-05-05T12:00:00Z").getTime();

function updateStage() {
  const now = Date.now();
  const elapsed = now - startTime;
  const stage = Math.min(Math.floor(elapsed / stageDuration), stages - 1);
  const price = (initialPrice * Math.pow(1.05, stage)).toFixed(6);
  const stageInfo = document.getElementById('stageInfo');
  const priceInfo = document.getElementById('priceInfo');
  if (stageInfo) stageInfo.textContent = `Stage: ${stage + 1} / ${stages}`;
  if (priceInfo) priceInfo.textContent = `Price: $${price}`;
}

function updateCountdown() {
  const end = startTime + 30 * 24 * 60 * 60 * 1000;
  const left = end - Date.now();
  const days = Math.floor(left / (1000 * 60 * 60 * 24));
  const hours = Math.floor((left / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((left / (1000 * 60)) % 60);
  const seconds = Math.floor((left / 1000) % 60);
  const countdown = document.getElementById('countdown');
  if (countdown) countdown.textContent = `Ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function buyFluffi() {
  const amount = parseFloat(document.getElementById('amountInput').value);
  const ref = localStorage.getItem('fluffiRef');

  if (!userWalletAddress) {
    alert('Please connect your wallet first.');
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  try {
    await initWeb3();

    const value = ethers.utils.parseEther(amount.toString()); // BNB amount
    const tx = await contract.contribute(ref || ethers.constants.AddressZero, { value });
    await tx.wait();

    // Simulate leaderboard
    if (ref && ref !== userWalletAddress) {
      const reward = amount * 0.1;
      leaderboard[ref] = (leaderboard[ref] || 0) + reward;
      localStorage.setItem('fluffiLeaderboard', JSON.stringify(leaderboard));
      renderLeaderboard();
      alert(`You bought $${amount} of FLUFFI. Referrer earned $${reward.toFixed(2)} bonus.`);
    } else {
      alert(`You bought $${amount} of FLUFFI.`);
    }
  } catch (err) {
    console.error('Buy failed:', err);
    alert('Transaction failed.');
  }
}

const contractAddress = "0x60A94bc12d0d4F782Fd597e5E1222247CFb7E297";
const contractABI = [
  { "inputs": [{ "internalType": "address", "name": "referrer", "type": "address" }], "name": "buyTokens", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "stakeTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

async function stakeFluffi() {
  const stakeInput = document.getElementById('stakeInput').value;
  const stakeAmount = parseFloat(stakeInput);
  if (!signer || !contract) {
    alert('Please connect your wallet first.');
    return;
  }
  if (isNaN(stakeAmount) || stakeAmount <= 0) {
    alert('Please enter a valid staking amount.');
    return;
  }
  try {
    const tokenAmount = ethers.utils.parseUnits(stakeAmount.toString(), 18);
    const tx = await contract.stakeTokens(tokenAmount);
    await tx.wait();
    alert('Staking successful!');
  } catch (error) {
    console.error('Staking failed:', error);
    alert('Staking failed. See console for details.');
  }
}
