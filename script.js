// FLUFFI Configuration
const FLUFFI_CONFIG = {
    presale: {
        hardCap: 150, // BNB
        initialPrice: 0.0001, // BNB per FLUFFI
        stages: 15
    },
    staking: {
        apy: 90 // 90% APY
    }
};

// Global variables
let web3;
let accounts = [];

// Initialize when page loads
window.addEventListener('load', async function() {
    await initWeb3();
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
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', function(newAccounts) {
                accounts = newAccounts;
                updateUI();
            });
            
            // Listen for chain changes
            window.ethereum.on('chainChanged', function(chainId) {
                window.location.reload();
            });
            
        } catch (error) {
            console.error("User denied account access");
        }
    }
    // Legacy dapp browsers
    else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
        accounts = await web3.eth.getAccounts();
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

// Connect wallet function
async function connectWallet() {
    if (!window.ethereum) {
        alert("Please install MetaMask or another Ethereum wallet");
        return;
    }
    
    try {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        updateUI();
        
        // Update button text
        const shortAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
        document.getElementById('connectWallet').innerHTML = `<i class="fas fa-check"></i> ${shortAddress}`;
        
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Error connecting wallet: " + error.message);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(function(button) {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Connect wallet button
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    
    // Buy tokens button
    document.getElementById('buyTokens').addEventListener('click', buyTokens);
    
    // Update estimated tokens when input changes
    document.getElementById('buyAmount').addEventListener('input', updateEstimatedTokens);
}

// Switch tabs
function switchTab(tabId) {
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(function(btn) {
        btn.classList.remove('active');
    });
    document.querySelector('.tab-button[data-tab="' + tabId + '"]').classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
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
        // Convert amount to wei
        const amountWei = web3.utils.toWei(amount, 'ether');
        
        // In a real implementation, you would call your presale contract here
        // Example:
        // await presaleContract.methods.buyTokens().send({
        //     from: accounts[0],
        //     value: amountWei
        // });
        
        alert(`Success! You would receive ${amount / FLUFFI_CONFIG.presale.initialPrice} FLUFFI tokens`);
        document.getElementById('buyAmount').value = '';
        
    } catch (error) {
        console.error("Error buying tokens:", error);
        alert("Error buying tokens: " + error.message);
    }
}

// Update estimated tokens
function updateEstimatedTokens() {
    const amount = parseFloat(document.getElementById('buyAmount').value) || 0;
    const tokens = amount / FLUFFI_CONFIG.presale.initialPrice;
    document.getElementById('estimatedTokens').textContent = tokens.toLocaleString() + " FLUFFI";
}

// Update UI
function updateUI() {
    const walletInfo = document.getElementById('walletInfo');
    
    if (accounts.length > 0) {
        const shortAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
        document.getElementById('connectWallet').innerHTML = `<i class="fas fa-check"></i> ${shortAddress}`;
        
        if (walletInfo) {
            walletInfo.classList.remove('hidden');
            document.getElementById('walletAddress').textContent = shortAddress;
        }
    } else {
        document.getElementById('connectWallet').innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
        if (walletInfo) walletInfo.classList.add('hidden');
    }
    
    // Update presale info
    document.getElementById('hardCap').textContent = FLUFFI_CONFIG.presale.hardCap + " BNB";
    document.getElementById('currentPrice').textContent = FLUFFI_CONFIG.presale.initialPrice + " BNB/FLUFFI";
    
    // Update staking info
    document.getElementById('apyValue').textContent = FLUFFI_CONFIG.staking.apy + "%";
}
