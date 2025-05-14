<script type="module">
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.8.1/+esm";

// --- Global Variables ---
let provider, signer, contract, userWalletAddress = null;
const contractAddress = "0x60A94bc12d0d4F782Fd597e5E1222247CFb7E297";
const contractABI = [
  {
    "inputs": [{"internalType": "address", "name": "referrer", "type": "address"}],
    "name": "contribute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
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

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('walletButton')?.addEventListener('click', connectWallet);
  document.getElementById('buyButton')?.addEventListener('click', buyFluffi);
  document.getElementById('toggleDarkMode')?.addEventListener('click', toggleDarkMode);
  document.getElementById('stakeButton')?.addEventListener('click', stakeFluffi);

  updateStage();
  updateCountdown();
  renderLeaderboard();

  setInterval(() => {
    updateStage();
    updateCountdown();
  }, 1000);

  // Apply saved dark mode preference
  const darkMode = localStorage.getItem('fluffiDarkMode') === 'true';
  if (darkMode) {
    document.documentElement.classList.add('dark');
  }
});

// --- Wallet Connect ---
async function connectWallet() {
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

// --- Dark Mode Toggle ---
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('fluffiDarkMode', document.documentElement.classList.contains('dark'));
}

// --- Buy Function ---
async function buyFluffi() {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (chainId !== "0x61") {
    alert("Please switch to BSC Testnet");
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: "0x61" }],
    });
    return;
  }

  const usdAmount = parseFloat(document.getElementById('amountInput').value);
  if (isNaN(usdAmount)) {
    alert("Invalid amount");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const ethAmount = (usdAmount * 0.0004).toFixed(6);

    const tx = await contract.contribute(ethers.ZeroAddress, {
      value: ethers.parseEther(ethAmount.toString())
    });

    alert(`Transaction sent! Hash: ${tx.hash}`);
    await tx.wait();
    alert("Purchase confirmed!");

  } catch (error) {
    console.error("Buy failed:", error);
    alert(`Error: ${error.message}`);
  }
}

// --- Placeholder for staking ---
async function stakeFluffi() {
  alert("Staking functionality coming soon.");
}

// --- Placeholder functions ---
function updateStage() {
  // Add logic for updating presale stage
}

function updateCountdown() {
  // Add logic for countdown timer
}

function renderLeaderboard() {
  // Add logic for displaying leaderboard
}
</script>
