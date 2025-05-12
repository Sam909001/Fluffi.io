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

// --- Fixed Buy Function ---
async function buyFluffi() {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  // 1. Check network (BSC Testnet = 0x61, Mainnet = 0x38)
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (chainId !== "0x61") { // BSC Testnet
    alert("Please switch to BSC Testnet");
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: "0x61" }],
    });
    return;
  }

  // 2. Get inputs
  const usdAmount = parseFloat(document.getElementById('amountInput').value);
  if (isNaN(usdAmount)) {
    alert("Invalid amount");
    return;
  }

  try {
    // 3. Initialize provider (use existing if you have global one)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0x60A94bc12d0d4F782Fd597e5E1222247CFb7E297", // Your testnet address
      contractABI,
      signer
    );

    // 4. Calculate ETH amount (adjust rate as needed)
    const ethAmount = (usdAmount * 0.0004).toFixed(6); // $1 = 0.0004 BNB

    // 5. Send transaction
    const tx = await contract.contribute(ethers.ZeroAddress, { // No referral
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
</script>
