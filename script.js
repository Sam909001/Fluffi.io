<script type="module">
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.8.1/+esm";

// --- Global Variables ---
let provider, signer, contract, userWalletAddress = null;
const contractAddress = "0x60A94bc12d0d4F782Fd597e5E1222247CFb7E297";
const contractABI = [
  {
    "inputs": [{ "internalType": "address", "name": "referrer", "type": "address" }],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "stakeTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// --- Referral Tracking ---
const urlParams = new URLSearchParams(window.location.search);
const refWallet = urlParams.get('ref');
if (refWallet) {
  localStorage.setItem('fluffiRef', refWallet);
}

// --- Leaderboard Simulation ---
let leaderboard = JSON.parse(localStorage.getItem('fluffiLeaderboard')) || {};

// --- Init Wallet ---
async function initWeb3() {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  userWalletAddress = await signer.getAddress();
  contract = new ethers.Contract(contractAddress, contractABI, signer);
  console.log('✅ Wallet connected:', userWalletAddress);
}

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  updateStage();
  updateCountdown();
  renderLeaderboard();
  setInterval(() => {
    updateStage();
    updateCountdown();
  }, 1000);

  const buyButton = document.getElementById('buyButton');
  const amountInput = document.getElementById('amountInput');
  if (buyButton && amountInput) {
    buyButton.addEventListener('click', buyFluffi);
  }

  const stakeBtn = document.getElementById('stakeButton');
  if (stakeBtn) stakeBtn.addEventListener('click', stakeFluffi);
});

// --- Buy Function ---
async function buyFluffi() {
  if (!userWalletAddress) {
    await initWeb3(); // Initialize if not connected
    if (!userWalletAddress) return;
  }

  const contractABI = [
  {
    "inputs": [{"name": "referrer", "type": "address"}],
    "name": "contribute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // ... keep other necessary functions
];
  const usdAmount = parseFloat(document.getElementById('amountInput').value);
  if (isNaN(usdAmount) || usdAmount <= 0) {
    alert('Please enter valid amount');
    return;
  }

  try {
    // Use the globally initialized contract
    const ethAmount = usdAmount * 0.0004;
    const ref = document.getElementById('refInput').value || ethers.ZeroAddress;

    // Call the CORRECT function from your ABI
    const tx = await contract.contribute(ref, {
      value: ethers.parseEther(ethAmount.toString())
    });

    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Confirmed:', receipt);
    alert('Purchase successful!');
    
  } catch (error) {
    console.error('Purchase failed:', error);
    alert(`Error: ${error.message}`);
    // Update UI during tx processing
document.getElementById('buyButton').disabled = true;
// Re-enable after confirmation
receipt.wait().then(() => {
  document.getElementById('buyButton').disabled = false;
});
  }
}
// --- Price + Stage Update ---
const initialPrice = 0.0001;
const stages = 15;
const stageDuration = 1000 * 60 * 60 * 48; // 48 hours
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

// --- Countdown Timer ---
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

// --- Render Leaderboard ---
function renderLeaderboard() {
  const container = document.getElementById('leaderboard');
  if (!container) return;
  container.innerHTML = '<h3 class="text-lg font-bold mb-2">Top Referrers</h3>';
  const sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (sorted.length === 0) {
    container.innerHTML += '<p class="text-sm text-gray-500">No referrals yet.</p>';
  } else {
    sorted.forEach(([address, amount], index) => {
      container.innerHTML += `<p class="text-sm">${index + 1}. ${address} - $${amount.toFixed(2)}</p>`;
    });
  }
}
</script>
