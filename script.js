// FLUFFI Configuration
const FLUFFI_CONFIG = {
  token: {
    name: "FLUFFI",
    symbol: "FLUFFI",
    decimals: 18,
    totalSupply: 10000000000
  },
  presale: {
    hardCap: 150, // BNB
    softCap: 50, // BNB
    initialPrice: 0.0001, // BNB per FLUFFI
    stages: 15,
    stageDuration: 48 * 60 * 60 * 1000 // 48 hours in ms
  },
  staking: {
    apy: 90 // 90% APY
  }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  initWeb3();
  setupEventListeners();
  updateUI();
  startStageCountdown();
});

// Web3 Initialization
async function initWeb3() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Wallet connected");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  } else {
    console.log("Please install MetaMask");
  }
}

// Event Listeners
function setupEventListeners() {
  // Wallet connection
  document.getElementById('connectWallet').addEventListener('click', connectWallet);
  
  // Tab switching
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
  
  // Buy tokens
  document.getElementById('buyTokens').addEventListener('click', buyTokens);
}

// Connect Wallet
async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected:", accounts[0]);
      updateUI();
    } catch (error) {
      console.error("Error connecting:", error);
    }
  }
}

// Update UI
function updateUI() {
  // Update presale info
  document.getElementById('hardCap').textContent = FLUFFI_CONFIG.presale.hardCap + " BNB";
  document.getElementById('currentPrice').textContent = FLUFFI_CONFIG.presale.initialPrice + " BNB";
  
  // Update staking info
  document.getElementById('apyValue').textContent = FLUFFI_CONFIG.staking.apy + "%";
}

// Switch Tabs
function switchTab(tabId) {
  // Update active tab button
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
  
  // Update active tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
}

// Start Stage Countdown
function startStageCountdown() {
  const endTime = Date.now() + FLUFFI_CONFIG.presale.stageDuration;
  
  const timer = setInterval(function() {
    const now = Date.now();
    const distance = endTime - now;
    
    if (distance < 0) {
      clearInterval(timer);
      return;
    }
    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('stageCountdown').textContent = 
      `${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// Buy Tokens
function buyTokens() {
  const amount = document.getElementById('buyAmount').value;
  if (!amount) {
    alert("Please enter an amount");
    return;
  }
  console.log(`Buying tokens with ${amount} BNB`);
  // In a real implementation, this would interact with your smart contract
}
