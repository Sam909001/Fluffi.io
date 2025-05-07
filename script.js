// ==================== Wallet Connection Manager ====================
let userWalletAddress = null;
let isWalletConnected = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeWallet);

// Core Wallet Functions
async function initializeWallet() {
  await checkExistingConnection();
  setupEventListeners();
}

async function checkExistingConnection() {
  if (!window.ethereum) return;
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      userWalletAddress = accounts[0];
      isWalletConnected = true;
      updateWalletUI();
    }
  } catch (error) {
    console.error("Connection check failed:", error);
  }
}

async function connectWallet() {
  if (isWalletConnected) return;

  try {
    // 1. Validate Ethereum provider
    if (!window.ethereum) {
      throw new Error("Ethereum wallet not detected");
    }

    // 2. Request connection (triggers MetaMask popup)
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    // 3. Validate response
    if (!accounts || accounts.length === 0) {
      throw new Error("Connection rejected");
    }

    // 4. Update state
    userWalletAddress = accounts[0];
    isWalletConnected = true;
    updateWalletUI();

  } catch (error) {
    handleConnectionError(error);
  }
}

function handleConnectionError(error) {
  console.error("Wallet connection failed:", error);
  isWalletConnected = false;
  userWalletAddress = null;
  updateWalletUI();

  // User-friendly error messages
  if (error.code === 4001) {
    alert("Connection request was declined");
  } else if (error.code === -32002) {
    alert("Connection request already pending");
  } else {
    alert(`Connection error: ${error.message}`);
  }
}

function setupEventListeners() {
  if (!window.ethereum) return;

  // Handle account changes
  window.ethereum.on('accountsChanged', (accounts) => {
    isWalletConnected = accounts.length > 0;
    userWalletAddress = accounts[0] || null;
    updateWalletUI();
  });

  // Handle chain changes
  window.ethereum.on('chainChanged', () => {
    window.location.reload(); // Recommended by MetaMask docs
  });
}

// UI Updates
function updateWalletUI() {
  const button = document.getElementById('walletButton');
  if (!button) return;

  if (isWalletConnected && userWalletAddress) {
    button.textContent = `Connected: ${shortenAddress(userWalletAddress)}`;
    button.style.backgroundColor = '#4CAF50';
    button.classList.add('connected');
  } else {
    button.textContent = 'Connect Wallet';
    button.style.backgroundColor = '';
    button.classList.remove('connected');
  }
}

// Helper function
function shortenAddress(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
}

// ==================== Integration with Existing Code ====================
// Your existing functions can simply check isWalletConnected/userWalletAddress
// Example:
function buyFluffi() {
  if (!isWalletConnected) {
    alert("Please connect your wallet first");
    return;
  }
  // ... rest of your buy logic
}
