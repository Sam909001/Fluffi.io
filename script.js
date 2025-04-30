// Fluffi.io Wallet Connection Manager
let walletAddress = null;
let isConnecting = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  await checkConnectedWallet();
  setupEventListeners();
});

// Check if wallet is already connected
async function checkConnectedWallet() {
  if (typeof window.ethereum === 'undefined') return;
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      walletAddress = accounts[0];
      updateWalletUI();
    }
  } catch (error) {
    console.error("Auto-connect failed:", error);
  }
}

// Connect wallet button handler
async function connectWallet() {
  if (isConnecting) return;
  if (!window.ethereum) return alert("MetaMask not installed!");

  isConnecting = true;
  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts',
    }).catch(err => {
      if (err.code === 4001) throw new Error("Connection rejected");
      if (err.message.includes('already pending')) {
        throw new Error("Please complete the pending MetaMask request first");
      }
      throw err;
    });

    walletAddress = accounts[0];
    updateWalletUI();
    
    // Initialize contract after connection
    initContract();
    
  } catch (error) {
    showError(error.message);
  } finally {
    isConnecting = false;
  }
}

// Update UI after connection
function updateWalletUI() {
  const walletBtn = document.getElementById('connectWallet');
  if (!walletBtn) return;
  
  if (walletAddress) {
    walletBtn.textContent = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    walletBtn.classList.add('connected');
  } else {
    walletBtn.textContent = "Connect Wallet";
    walletBtn.classList.remove('connected');
  }
}

// Error handling
function showError(message) {
  const errorElement = document.getElementById('walletError') || createErrorElement();
  errorElement.textContent = message;
  setTimeout(() => errorElement.textContent = '', 5000);
}

function createErrorElement() {
  const div = document.createElement('div');
  div.id = 'walletError';
  div.style.color = 'red';
  div.style.marginTop = '10px';
  document.querySelector('.wallet-container').appendChild(div);
  return div;
}

// Event listeners
function setupEventListeners() {
  const walletBtn = document.getElementById('connectWallet');
  if (walletBtn) walletBtn.addEventListener('click', connectWallet);

  // Handle account changes
  window.ethereum?.on('accountsChanged', (accounts) => {
    walletAddress = accounts.length > 0 ? accounts[0] : null;
    updateWalletUI();
    if (!walletAddress) showError("Wallet disconnected");
  });
}

// Initialize contract (add your existing contract logic here)
function initContract() {
  console.log("Wallet connected, ready for contract interactions:", walletAddress);
  // Your existing contract initialization code goes here
}
