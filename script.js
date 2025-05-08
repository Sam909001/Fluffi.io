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
document.getElementById("walletButton").addEventListener("click", connectWallet);
document.addEventListener('DOMContentLoaded', renderLeaderboard);
<script>
let userWalletAddress = null;

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      userWalletAddress = await signer.getAddress();

      document.getElementById("walletButton").textContent = "Connected";
      console.log("Wallet connected:", userWalletAddress);
    } catch (error) {
      console.error("User rejected connection:", error);
      alert("Wallet connection rejected.");
    }
  } else {
    alert("MetaMask not found. Please install MetaMask.");
  }
}
  function updateCountdown() {
    const end = startTime + 30 * 24 * 60 * 60 * 1000;
    const left = end - Date.now();
    const days = Math.floor(left / (1000 * 60 * 60 * 24));
    const hours = Math.floor((left / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((left / (1000 * 60)) % 60);
    const seconds = Math.floor((left / 1000) % 60);
    document.getElementById('countdown').textContent = `Ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
// ===== Secure Wallet Connection =====
const walletManager = {
  address: null,
  isConnected: false,

  init: function() {
    this.setupButton();
    this.checkConnection();
    this.setupListeners();
  },

  setupButton: function() {
    const btn = document.getElementById('walletButton');
    if (btn) {
      // Remove any existing handlers to prevent duplicates
      btn.replaceWith(btn.cloneNode(true));
      document.getElementById('walletButton').onclick = () => this.connect();
    }
  },

  connect: async function() {
    if (this.isConnected) return;

    try {
      // 1. Validate provider
      if (!this.hasEthereum()) {
        this.showWalletModal();
        return;
      }

      // 2. Request accounts
      const accounts = await this.requestAccounts();
      
      // 3. Update state
      if (accounts.length > 0) {
        this.updateState(accounts[0], true);
      }
    } catch (error) {
      this.handleError(error);
    }
  },
  // CSP-safe Ethereum methods
  hasEthereum: function() {
    return !!(window.ethereum && window.ethereum.isMetaMask);
  },

  requestAccounts: function() {
    return window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    }).catch(err => {
      throw new Error('Connection rejected');
    });
  },

  updateState: function(address, isConnected) {
    const btn = document.getElementById('walletButton');
    if (!btn) return;

    this.address = address;
    this.isConnected = isConnected;

    // Update UI without eval/inline handlers
    btn.textContent = isConnected 
      ? `Connected: ${address.substring(0, 6)}...${address.slice(-4)}`
      : 'Connect Wallet';
    btn.dataset.connected = isConnected;
  },

  checkConnection: async function() {
    if (!this.hasEthereum()) return;
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });
      if (accounts.length > 0) {
        this.updateState(accounts[0], true);
      }
    } catch (error) {
      console.warn('Connection check failed:', error);
    }
  },

  setupListeners: function() {
    if (!this.hasEthereum()) return;
    
    window.ethereum.on('accountsChanged', (accounts) => {
      this.updateState(accounts[0] || null, accounts.length > 0);
    });
  },

  showWalletModal: function() {
    // CSP-safe alternative to alert()
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position:fixed;top:0;left:0;right:0;background:#ffebee;padding:1rem;text-align:center;">
        <p>Please install <a href="https://metamask.io/" target="_blank">MetaMask</a> to continue</p>
        <button onclick="this.parentElement.remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  },

  handleError: function(error) {
    console.error('Wallet error:', error);
    this.updateState(null, false);
    
    // CSP-safe error display
    if (error.code === 4001) {
      this.showErrorModal('Connection was rejected');
    } else {
      this.showErrorModal(error.message);
    }
  },

  showErrorModal: function(message) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="position:fixed;bottom:1rem;right:1rem;background:#ffebee;padding:1rem;border-radius:8px;">
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
};

// Initialize
if (document.readyState === 'complete') {
  walletManager.init();
} else {
  document.addEventListener('DOMContentLoaded', () => walletManager.init());
}
document.getElementById("walletButton").textContent = 
  userWalletAddress.slice(0, 6) + "..." + userWalletAddress.slice(-4);
