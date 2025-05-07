// --- Wallet Connection Manager ---
let userWalletAddress = null;
let isWalletConnected = false;

// Helper function
function shortenAddress(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
}

async function connectWallet() {
  const walletButton = document.getElementById('walletButton');
  
  // Early return if already connected
  if (isWalletConnected) {
    console.log("Wallet already connected");
    return;
  }

  try {
    // Check if Ethereum provider exists
    if (!window.ethereum) {
      throw new Error("No Ethereum provider detected");
    }

    // Request accounts
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    // Validate response
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts returned");
    }

    // Update state
    userWalletAddress = accounts[0];
    isWalletConnected = true;
    
    // Update UI
    walletButton.textContent = `Connected: ${shortenAddress(userWalletAddress)}`;
    walletButton.style.backgroundColor = '#4CAF50';
    
  } catch (error) {
    console.error("Connection failed:", error);
    walletButton.textContent = 'Connect Wallet';
    walletButton.style.backgroundColor = '';
    isWalletConnected = false;
    userWalletAddress = null;

    if (error.code === 4001) {
      alert("You declined the connection request");
    } else {
      alert(`Connection error: ${error.message}`);
    }
  }
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
