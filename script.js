// --- Added: Wallet Connection State Management ---
let userWalletAddress = null;

// --- Modified: Check Existing Connection on Page Load ---
async function checkExistingConnection() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        userWalletAddress = accounts[0];
        updateWalletButton(true);
      }
    } catch (error) {
      console.error('Connection check failed:', error);
    }
  }
}

// --- Modified: Robust Connect Wallet Function ---
async function connectWallet() {
  if (!window.ethereum) {
    alert('MetaMask not detected.');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }
    
    // --- Added: Network Validation ---
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x1') { // Replace with your expected chain ID
      alert('Please connect to Ethereum Mainnet');
      return;
    }

    userWalletAddress = accounts[0];
    updateWalletButton(true);
    
    // --- Added: Wallet Event Listeners ---
    window.ethereum.on('accountsChanged', (newAccounts) => {
      if (newAccounts.length === 0) {
        // Disconnected
        userWalletAddress = null;
        updateWalletButton(false);
      } else {
        // Account changed
        userWalletAddress = newAccounts[0];
      }
    });

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload(); // Reload on network change
    });

  } catch (error) {
    console.error('Connection failed:', error);
    updateWalletButton(false);
    if (error.code === 4001) {
      alert('Connection request rejected');
    } else {
      alert('Connection failed. Please try again.');
    }
  }
}

// --- Added: UI State Management ---
function updateWalletButton(isConnected) {
  const button = document.getElementById('walletButton');
  if (isConnected) {
    button.textContent = 'Connected';
    button.classList.add('connected');
    button.classList.remove('connecting');
  } else {
    button.textContent = 'Connect Wallet';
    button.classList.remove('connected');
    button.classList.remove('connecting');
  }
}

// --- Modified Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
  checkExistingConnection(); // Check existing connection on load
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
// Event listener setup
document.addEventListener('DOMContentLoaded', () => {
  // Wallet connection
  document.getElementById('walletButton').addEventListener('click', connectWallet);
  
  // Dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
  
  // Buy button
  document.getElementById('buyButton').addEventListener('click', buyFluffi);
  
  // Stake button
  document.getElementById('stakeButton').addEventListener('click', stakeFluffi);
});
