// FLUFFI Configuration
const FLUFFI_CONFIG = {
    presale: {
        hardCap: 150,
        initialPrice: 0.0001,
        stages: 15
    },
    staking: {
        apy: 90
    }
};

// Initialize when page loads
window.addEventListener('load', function() {
    setupEventListeners();
    updateUI();
});

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

// Connect wallet
function connectWallet() {
    alert("Wallet connection would be implemented here with Web3");
    // In a real implementation, this would connect to MetaMask or other wallet
}

// Buy tokens
function buyTokens() {
    const amount = document.getElementById('buyAmount').value;
    if (!amount) {
        alert("Please enter an amount");
        return;
    }
    alert("Buying " + amount + " BNB worth of FLUFFI tokens");
    // In a real implementation, this would interact with your smart contract
}

// Update estimated tokens
function updateEstimatedTokens() {
    const amount = parseFloat(document.getElementById('buyAmount').value) || 0;
    const tokens = amount / FLUFFI_CONFIG.presale.initialPrice;
    document.getElementById('estimatedTokens').textContent = tokens.toLocaleString() + " FLUFFI";
}

// Update UI
function updateUI() {
    document.getElementById('hardCap').textContent = FLUFFI_CONFIG.presale.hardCap + " BNB";
    document.getElementById('currentPrice').textContent = FLUFFI_CONFIG.presale.initialPrice + " BNB/FLUFFI";
    document.getElementById('apyValue').textContent = FLUFFI_CONFIG.staking.apy + "%";
}
