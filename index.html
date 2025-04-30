// Wallet Connection Manager
let walletAddress = null;
let isConnecting = false;

// DOM Elements
const connectButtons = [
    document.getElementById('connectWallet'),
    document.getElementById('mainConnect')
];
const buyButtons = [
    document.getElementById('buyButton'),
    document.getElementById('mainBuy')
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Setup event listeners
    connectButtons.forEach(btn => {
        if (btn) btn.addEventListener('click', connectWallet);
    });
    
    buyButtons.forEach(btn => {
        if (btn) btn.addEventListener('click', handleBuy);
    });
    
    // Check existing connection
    checkWalletConnection();
    
    // Handle account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            walletAddress = accounts.length > 0 ? accounts[0] : null;
            updateUI();
        });
    }
});

// Check if wallet is already connected
async function checkWalletConnection() {
    if (typeof window.ethereum === 'undefined') return;
    
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            walletAddress = accounts[0];
            updateUI();
        }
    } catch (error) {
        console.error("Auto-connect check failed:", error);
    }
}

// Connect Wallet Function
async function connectWallet() {
    if (isConnecting) return;
    if (!window.ethereum) return showError("Please install MetaMask!");
    
    isConnecting = true;
    try {
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        }).catch(err => {
            if (err.code === 4001) throw new Error("Connection rejected");
            if (err.message.includes('already pending')) {
                throw new Error("Please complete the pending request in MetaMask first");
            }
            throw err;
        });
        
        walletAddress = accounts[0];
        updateUI();
        showSuccess("Wallet connected successfully!");
        
    } catch (error) {
        showError(error.message);
    } finally {
        isConnecting = false;
    }
}

// Handle Buy Function
function handleBuy() {
    if (!walletAddress) {
        showError("Please connect your wallet first!");
        return;
    }
    
    // Replace with your actual buy logic
    alert("Buy functionality will be implemented here!");
    console.log("Initiating purchase for:", walletAddress);
}

// Update UI
function updateUI() {
    const walletText = walletAddress 
        ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
        : "Connect Wallet";
    
    const buttonClass = walletAddress ? "button connected" : "button";
    
    connectButtons.forEach(btn => {
        if (btn) {
            btn.textContent = walletText;
            btn.className = buttonClass;
        }
    });
    
    buyButtons.forEach(btn => {
        if (btn) btn.disabled = !walletAddress;
    });
}

// Error/Success Messages
function showError(message) {
    const errorElement = document.getElementById('walletError');
    if (errorElement) {
        errorElement.textContent = message;
        setTimeout(() => errorElement.textContent = '', 5000);
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    alert(message); // Replace with toast notification if preferred
}
