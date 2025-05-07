// --- Referral Tracking ---
const urlParams = new URLSearchParams(window.location.search);
const refWallet = urlParams.get('ref');
if (refWallet) {
  localStorage.setItem('fluffiRef', refWallet);
}

// --- Simulated Leaderboard Data ---
let leaderboard = JSON.parse(localStorage.getItem('fluffiLeaderboard')) || {};

// --- Buy Function With Referral ---
function buyFluffi() {
  const amount = parseFloat(document.getElementById('amountInput').value);
  const ref = localStorage.getItem('fluffiRef');

  if (!userWalletAddress) {
    alert('Please connect your wallet first.');
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  // Simulated Referral Reward
  if (ref && ref !== userWalletAddress) {
    const reward = amount * 0.10; // 10% bonus to referrer
    leaderboard[ref] = (leaderboard[ref] || 0) + reward;
    localStorage.setItem('fluffiLeaderboard', JSON.stringify(leaderboard));
    alert(`You are buying $${amount} of FLUFFI. Referrer ${ref} earns $${reward.toFixed(2)} bonus.`);
  } else {
    alert(`You are buying $${amount} of FLUFFI.`);
  }
}

// --- Render Leaderboard ---
function renderLeaderboard() {
  const container = document.getElementById('leaderboard');
  container.innerHTML = '<h3 class="text-lg font-bold mb-2">Top Referrers</h3>';
  const sorted = Object.entries(leaderboard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sorted.length === 0) {
    container.innerHTML += '<p class="text-sm text-gray-500">No referrals yet.</p>';
  } else {
    sorted.forEach(([address, amount], index) => {
      container.innerHTML += `<p class="text-sm">${index + 1}. ${address} - $${amount.toFixed(2)}</p>`;
    });
  }
}
document.addEventListener('DOMContentLoaded', renderLeaderboard);
<script>
// Wallet Connection Manager
let userWalletAddress = null;
let isWalletConnected = false;

async function connectWallet() {
  const walletButton = document.getElementById('walletButton');
  
  // Debug: Log initial state
  console.log("Connect Wallet clicked. Current state:", { 
    isWalletConnected, 
    userWalletAddress 
  });

  // Early return if already connected
  if (isWalletConnected) {
    console.log("Wallet already connected");
    return;
  }

  try {
    // 1. Check if Ethereum provider exists
    if (!window.ethereum) {
      throw new Error("No Ethereum provider detected");
    }

    // 2. Request accounts - THIS is where MetaMask pops up
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    // 3. Validate the response
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts returned");
    }

    // 4. Update connection state
    userWalletAddress = accounts[0];
    isWalletConnected = true;
    
    // 5. Update UI
    walletButton.textContent = `Connected: ${shortenAddress(userWalletAddress)}`;
    walletButton.style.backgroundColor = '#4CAF50';
    walletButton.onclick = null; // Disable further clicks
    
    console.log("Successfully connected:", userWalletAddress);

  } catch (error) {
    // 6. Handle all possible errors
    console.error("Connection failed:", error);
    
    walletButton.textContent = 'Connect Wallet';
    walletButton.style.backgroundColor = '';
    isWalletConnected = false;
    userWalletAddress = null;

    // Specific error messages
    if (error.code === 4001) {
      alert("You declined the connection request");
    } else {
      alert(`Connection error: ${error.message}`);
    }
  }
}

// Helper function
function shortenAddress(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
}

// Account change listener
if (!window.ethereum.isMetaMask) {
  alert("Please ensure MetaMask is installed and enabled");
  window.open('https://metamask.io/download.html', '_blank');
  return;
}
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    const walletButton = document.getElementById('walletButton');
    
    if (accounts.length === 0) {
      // Disconnected
      walletButton.textContent = 'Connect Wallet';
      walletButton.style.backgroundColor = '';
      walletButton.onclick = connectWallet; // Re-enable clicks
      isWalletConnected = false;
      userWalletAddress = null;
      console.log("Wallet disconnected");
    } else {
      // Account changed
      userWalletAddress = accounts[0];
      walletButton.textContent = `Connected: ${shortenAddress(userWalletAddress)}`;
      console.log("Account changed to:", userWalletAddress);
    }
  });
}

  function buyFluffi() {
    const amount = document.getElementById('amountInput').value;
    const ref = document.getElementById('refInput').value || localStorage.getItem('referrer') || 'none';
    if (!userWalletAddress) {
      alert('Please connect your wallet first.');
      return;
    }
    alert(`Buying $FLUFFI worth $${amount} with referral: ${ref}`);
  }

  function stakeFluffi() {
    const amount = document.getElementById('stakeInput').value;
    if (!userWalletAddress) {
      alert('Please connect your wallet first.');
      return;
    }
    alert(`Staking ${amount} $FLUFFI with 90% APY`);
  }

  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }

  // --- Referral Logic ---
  function getReferrerFromURL() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('referrer', ref);
    }
  }

  function applyReferralField() {
    const savedRef = localStorage.getItem('referrer');
    if (savedRef) {
      const refInput = document.getElementById('refInput');
      if (refInput) {
        refInput.value = savedRef;
      }
    }
  }

  // Initial setup
  getReferrerFromURL();
  applyReferralField();
  updateStage();
  updateCountdown();
  setInterval(() => {
    updateStage();
    updateCountdown();
  }, 1000);
</script>
