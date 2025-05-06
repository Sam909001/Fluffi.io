// script.js for FLUFFI Presale on BSC

const CONTRACT_ADDRESS = "0x60A94bc12d0d4F782Fd597e5E1222247CFb7E297";
const ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"}],"name":"Contribution","type":"event"},
  {"anonymous":false,"inputs":[],"name":"PresaleEnded","type":"event"},
  {"inputs":[],"name":"RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"endPresale","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getContributorAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"presaleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrals","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"setTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"stateMutability":"payable","type":"receive"}
];

const BSC_PARAMS = {
  chainId: '0x38', // Mainnet. Use '0x61' for Testnet.
  chainName: 'Binance Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/']
};

async function switchToBSC() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [BSC_PARAMS]
      });
    } catch (err) {
      console.error('Switch to BSC failed:', err);
    }
  }
}

async function connectWallet() {
  if (window.ethereum) {
    try {
      // Prompt wallet to switch to BNB Smart Chain
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }] // BSC Mainnet
      });

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userWalletAddress = accounts[0];
      document.getElementById('walletButton').textContent = 'Connected';
    } catch (error) {
      if (error.code === 4902) {
        alert('Please add BNB Smart Chain to MetaMask manually.');
      } else {
        alert('Wallet connection failed.');
        console.error(error);
      }
    }
  } else {
    alert('MetaMask not detected.');
  }
}

async function buyFluffi(amountBNB, referrerAddress = "0x0000000000000000000000000000000000000000") {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask to proceed.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const amountInWei = ethers.utils.parseEther(amountBNB.toString());

    const tx = await contract.contribute(referrerAddress, {
      value: amountInWei,
    });

    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    alert("Success! You bought FLUFFI tokens.");
  } catch (err) {
    console.error("Buy failed:", err);
    alert("Transaction failed. See console for details.");
  }
}

function handleBuy() {
  const bnb = document.getElementById("bnbAmount").value;
  const ref = document.getElementById("referral").value || "0x0000000000000000000000000000000000000000";
  buyFluffi(bnb, ref);
}

document.addEventListener('DOMContentLoaded', () => {
  updateStage();
  updateCountdown();
  setInterval(() => {
    updateStage();
    updateCountdown();
  }, 1000);
});
