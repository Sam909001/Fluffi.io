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
  const amount = document.getElementById('amountInput').value;
  const ref = document.getElementById('refInput').value;

  if (!userWalletAddress) {
    alert('Please connect your wallet first.');
    return;
  }

  // Convert the amount in USD to the token's equivalent amount
  // You would need to implement this conversion based on the current price of $FLUFFI
  const amountInTokens = convertUSDToTokens(amount);

  // Check if the amount is valid
  if (amountInTokens <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  // Assuming your presale smart contract is deployed on Ethereum or Binance Smart Chain
  const presaleContractAddress = '0x60A94bc12d0d4F782Fd597e5E1222247CFb7E297';
  const presaleContractABI = [[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"}],"name":"Contribution","type":"event"},{"anonymous":false,"inputs":[],"name":"PresaleEnded","type":"event"},{"inputs":[],"name":"RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"endPresale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getContributorAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"presaleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrals","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"setTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
    {
      "constant": false,
      "inputs": [
        { "name": "amount", "type": "uint256" },
        { "name": "referral", "type": "address" }
      ],
      "name": "buyTokens",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    }
  ];

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(presaleContractAddress, presaleContractABI, signer);

    // Convert amount to the token's equivalent (depends on your contract logic)
    const amountInWei = ethers.utils.parseUnits(amountInTokens.toString(), 18); // assuming 18 decimal places

    // Call the contract's buy function with the referral address
    const tx = await contract.buyTokens(amountInWei, ref ? ref : '0x0000000000000000000000000000000000000000', {
      value: ethers.utils.parseEther(amount) // Amount in ETH (or BNB)
    });

    // Wait for transaction to be mined
    await tx.wait();

    // Notify the user
    alert('Transaction successful! You have bought $FLUFFI.');
  } catch (err) {
    console.error(err);
    alert('Transaction failed. Please try again.');
  }
}
function convertUSDToTokens(usdAmount) {
  const pricePerToken = 0.0001;
  return usdAmount / pricePerToken;
}
// --- Staking Function ---
async function stakeFluffi() {
  const stakeAmount = parseFloat(document.getElementById('stakeInput').value);
  if (!userWalletAddress || !contract) {
    alert('Please connect your wallet first.');
    await initWeb3();
    return;
  }
  if (isNaN(stakeAmount) || stakeAmount <= 0) {
    alert('Please enter a valid staking amount.');
    return;
  }

  try {
    const tokenAmount = ethers.parseUnits(stakeAmount.toString(), 18);
    const tx = await contract.stakeTokens(tokenAmount);
    await tx.wait();
    alert('✅ Staking successful!');
  } catch (err) {
    console.error('Staking failed:', err);
    alert('Staking failed.');
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
