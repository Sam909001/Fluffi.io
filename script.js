// FLUFFI Configuration
const FLUFFI_CONFIG = {
    paymentAddress: "0xFc3381a6AA1d134DDf22f641E97c92C400959910",
    presale: {
        hardCap: 150, // BNB
        initialPrice: 0.0001, // BNB per FLUFFI
        stages: 15
    },
    staking: {
        apy: 90 // 90% APY
    },
    supportedChains: {
        56: "Binance Smart Chain",
        97: "BSC Testnet"
    }
};

// Global variables
let web3;
let accounts = [];
let currentChainId;

// Initialize when page loads
window.addEventListener('DOMContentLoaded', function() {
    initWeb3();
    setupEventListeners();
    updateUI();
});

// Initialize Web3
async function initWeb3() {
    // Modern dapp browsers
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentChainId = await web3.eth.getChainId();
            
            // Verify chain is supported
            if (!FLUFFI_CONFIG.supportedChains[currentChainId]) {
                alert(`Please switch to ${Object.values(FLUFFI_CONFIG.supportedChains).join(" or ")}`);
            }
            
            // Set up event listeners
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
            
            updateUI();
            
        } catch (error) {
            console.error("User denied account access:", error);
        }
    }
    // Legacy dapp browsers
    else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
        accounts = await web3.eth.getAccounts();
        currentChainId = await web3.eth.getChainId();
        updateUI();
    }
    // Non-dapp browsers
    else {
        console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
        document.getElementById('connectWallet').textContent = "Install MetaMask";
        document.getElementById('connectWallet').onclick = function() {
            window.open('https://metamask.io/', '_blank');
        };
    }
}

// Handle account changes
function handleAccountsChanged(newAccounts) {
    accounts = newAccounts;
    updateUI();
}

// Handle chain changes
function handleChainChanged(chainId) {
    window.location.reload();
}

// Setup event listeners
function setupEventListeners() {
    // Connect wallet button
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    
    // Copy payment address button
    document.getElementById('copyPaymentAddress').addEventListener('click', copyPaymentAddress);
    
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(function(button) {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Buy tokens button
    document.getElementById('buyTokens').addEventListener('click', buyTokens);
    
    // Update estimated tokens when input changes
    document.getElementById('buyAmount').addEventListener('input', updateEstimatedTokens);
}

// Connect wallet
async function connectWallet() {
    if (!window.ethereum) {
        alert("Please install MetaMask or another Ethereum wallet");
        return;
    }
    
    try {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentChainId = await web3.eth.getChainId();
        updateUI();
        
        // Update button text
        const shortAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
        document.getElementById('connectWallet').innerHTML = `<i class="fas fa-check"></i> ${shortAddress}`;
        
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Error connecting wallet: " + error.message);
    }
}

// Copy payment address to clipboard
function copyPaymentAddress() {
    const addressInput = document.getElementById('paymentAddressDisplay');
    addressInput.select();
    document.execCommand('copy');
    
    // Show feedback
    const copyButton = document.getElementById('copyPaymentAddress');
    const originalText = copyButton.innerHTML;
    copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
        copyButton.innerHTML = originalText;
    }, 2000);
}

// Buy tokens function
async function buyTokens() {
    if (!accounts.length) {
        alert("Please connect your wallet first");
        return;
    }
    
    const amount = document.getElementById('buyAmount').value;
    if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    
    try {
        // Verify payment address
        const paymentAddress = FLUFFI_CONFIG.paymentAddress;
        const checksumAddress = web3.utils.toChecksumAddress(paymentAddress);
        
        // Show confirmation
        const confirmed = confirm(`You are about to send ${amount} BNB to:\n${paymentAddress}\n\nIs this correct?`);
        if (!confirmed) return;

        const amountWei = web3.utils.toWei(amount, 'ether');
        
        // Send transaction
        const tx = await web3.eth.sendTransaction({
            from: accounts[0],
            to: paymentAddress,
            value: amountWei
        });

        console.log("Transaction successful:", tx.transactionHash);
        alert("Payment successful! You will receive your FLUFFI tokens soon.");
        document.getElementById('buyAmount').value = '';
        
    } catch (error) {
        console.error("Payment failed:", error);
        alert("Payment failed: " + error.message);
    }
}

// Update estimated tokens
function updateEstimatedTokens() {
    const amount = parseFloat(document.getElementById('buyAmount').value) || 0;
    const tokens = amount / FLUFFI_CONFIG.presale.initialPrice;
    document.getElementById('estimatedTokens').textContent = tokens.toLocaleString() + " FLUFFI";
}

// Switch tabs
function switchTab(tabId) {
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(function(btn) {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Update UI
function updateUI() {
    const walletInfo = document.getElementById('walletInfo');
    const connectBtn = document.getElementById('connectWallet');
    
    if (accounts.length > 0) {
        const shortAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
        connectBtn.innerHTML = `<i class="fas fa-check"></i> ${shortAddress}`;
        
        walletInfo.classList.remove('hidden');
        document.getElementById('walletAddress').textContent = shortAddress;
    } else {
        connectBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
        walletInfo.classList.add('hidden');
    }
    
    // Update presale info
    document.getElementById('hardCap').textContent = FLUFFI_CONFIG.presale.hardCap + " BNB";
    document.getElementById('currentPrice').textContent = FLUFFI_CONFIG.presale.initialPrice + " BNB/FLUFFI";
    
    // Update staking info
    document.getElementById('apyValue').textContent = FLUFFI_CONFIG.staking.apy + "%";
    
    // Ensure payment address is correct
    document.getElementById('paymentAddressDisplay').value = FLUFFI_CONFIG.paymentAddress;
}
// Added to script.js for production:
setInterval(() => {
    const displayedAddr = document.getElementById('paymentAddressDisplay').value;
    if(displayedAddr !== FLUFFI_CONFIG.paymentAddress) {
        document.body.style.filter = 'grayscale(100%)';
        alert("SECURITY BREACH: Payment address modified!");
        window.location.href = "/security-alert";
    }
}, 5000);
// Added to prevent console tampering:
Object.defineProperty(window, "FLUFFI_CONFIG", {
    value: FLUFFI_CONFIG,
    writable: false,
    configurable: false
});
