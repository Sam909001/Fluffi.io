let userWalletAddress = null;
let isWalletConnected = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  checkInitialConnection();
});

// Check if already connected
async function checkInitialConnection() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        userWalletAddress = accounts[0];
        isWalletConnected = true;
        updateWalletButton();
      }
    } catch (error) {
      console.error("Initial connection check failed:", error);
    }
  }
}

// Main connection function
async function connectWallet() {
  if (isWalletConnected) return;

  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask!");
    }

    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("Connection rejected");
    }

    userWalletAddress = accounts[0];
    isWalletConnected = true;
    updateWalletButton();

  } catch (error) {
    console.error("Connection failed:", error);
    isWalletConnected = false;
    userWalletAddress = null;
    updateWalletButton();
    
    if (error.code === 4001) {
      alert("You declined the connection");
    } else {
      alert("Connection error: " + error.message);
    }
  }
}

// Update button UI
function updateWalletButton() {
  const button = document.getElementById('walletButton');
  if (isWalletConnected && userWalletAddress) {
    button.textContent = `Connected: ${userWalletAddress.slice(0, 6)}...${userWalletAddress.slice(-4)}`;
    button.style.backgroundColor = '#4CAF50';
  } else {
    button.textContent = 'Connect Wallet';
    button.style.backgroundColor = '';
  }
}
// Handle account changes
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      // Disconnected
      isWalletConnected = false;
      userWalletAddress = null;
    } else {
      // Account changed
      userWalletAddress = accounts[0];
      isWalletConnected = true;
    }
    updateWalletButton();
  });
}
// Account change listener
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    const walletButton = document.getElementById('walletButton');
    
    if (accounts.length === 0) {
      // Disconnected
      walletButton.textContent = 'Connect Wallet';
      walletButton.style.backgroundColor = '';
      isWalletConnected = false;
      userWalletAddress = null;
    } else {
      // Account changed
      userWalletAddress = accounts[0];
      walletButton.textContent = `Connected: ${shortenAddress(userWalletAddress)}`;
    }
  });
}

// --- Referral Tracking ---
function getReferrerFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}

function saveReferrer(ref) {
  if (ref && ref !== userWalletAddress) {
    localStorage.setItem('fluffiRef', ref);
  }
}

// --- Leaderboard System ---
let leaderboard = JSON.parse(localStorage.getItem('fluffiLeaderboard')) || {};

function updateLeaderboard(referrer, amount) {
  if (!referrer) return;
  
  const reward = amount * 0.10; // 10% bonus
  leaderboard[referrer] = (leaderboard[referrer] || 0) + reward;
  localStorage.setItem('fluffiLeaderboard', JSON.stringify(leaderboard));
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboard');
  if (!container) return;
  
  const sorted = Object.entries(leaderboard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  container.innerHTML = sorted.length > 0 
    ? sorted.map(([addr, amt], i) => 
        `<p>${i+1}. ${shortenAddress(addr)} - $${amt.toFixed(2)}</p>`).join('')
    : '<p>No referrals yet</p>';
}

// --- Transaction Functions ---
function buyFluffi() {
  if (!userWalletAddress) {
    alert('Please connect wallet first');
    return;
  }

  const amount = parseFloat(document.getElementById('amountInput').value);
  if (isNaN(amount) {
    alert('Invalid amount');
    return;
  }

  const referrer = localStorage.getItem('fluffiRef');
  updateLeaderboard(referrer, amount);
  
  alert(`Purchased $${amount.toFixed(2)}${referrer ? ` (Referred by ${shortenAddress(referrer)})` : ''}`);
}

function stakeFluffi() {
  if (!userWalletAddress) {
    alert('Please connect wallet first');
    return;
  }
  
  const amount = parseFloat(document.getElementById('stakeInput').value);
  if (isNaN(amount)) {
    alert('Invalid amount');
    return;
  }
  
  alert(`Staked ${amount} FLUFFI at 90% APY`);
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Set up referral
  const ref = getReferrerFromURL();
  if (ref) saveReferrer(ref);
  
  // Initialize UI
  renderLeaderboard();
  
  // Set up dark mode toggle
  document.querySelector('[onclick="toggleDarkMode()"]').addEventListener('click', toggleDarkMode);
});

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}
