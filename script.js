// FLUFFI Configuration
const FLUFFI_CONFIG = {
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
window.addEventListener('load', async function() {
    await initWeb3();
    setupEventListeners();
    updateUI();
    initWalletModal();
});

// Initialize Web3 with multiple provider support
async function initWeb3() {
    // Check if any wallet is already connected
    if (window.ethereum) {
        await handleEthereumProvider(window.ethereum);
    } else {
        // Show wallet selection modal if no provider detected
        showWalletModal();
    }
}

// Handle Ethereum provider
async function handleEthereumProvider(provider) {
    web3 = new Web3(provider);
    try {
        // Request account access
        accounts = await provider.request({ method: 'eth_requestAccounts' });
        currentChainId = await web3.eth.getChainId();
        
        // Verify chain is supported
        if (!FLUFFI_CONFIG.supportedChains[currentChainId]) {
            await switchToSupportedChain(provider);
        }
        
        // Set up event listeners
        provider.on('accountsChanged', handleAccountsChanged);
        provider.on('chainChanged', handleChainChanged);
        
        updateUI();
        
    } catch (error) {
        console.error("Error connecting wallet:", error);
        showWalletModal();
    }
}

// Initialize wallet selection modal
function initWalletModal() {
    const modalHTML = `
        <div id="walletModal" class="modal hidden">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Connect Wallet</h3>
                <div class="wallet-options">
                    <button id="mmConnect" class="wallet-button">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask">
                        MetaMask
                    </button>
                    <button id="wcConnect" class="wallet-button">
                        <img src="https://walletconnect.org/walletconnect-logo.png" alt="WalletConnect">
                        WalletConnect
                    </button>
                    <button id="cbConnect" class="wallet-button">
                        <img src="https://www.coinbase.com/assets/coinbase-wallet-logo-6e5a9a209a1a4b349e3d582c95c8b9b6.png" alt="Coinbase Wallet">
                        Coinbase Wallet
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Event listeners for modal
    document.getElementById('mmConnect').addEventListener('click', connectMetaMask);
    document.getElementById('wcConnect').addEventListener('click', connectWalletConnect);
    document.getElementById('cbConnect').addEventListener('click', connectCoinbaseWallet);
    document.querySelector('.close').addEventListener('click', hideWalletModal);
}

// Show wallet selection modal
function showWalletModal() {
    document.getElementById('walletModal').classList.remove('hidden');
}

// Hide wallet selection modal
function hideWalletModal() {
    document.getElementById('walletModal').classList.add('hidden');
}

// Connect MetaMask
async function connectMetaMask() {
    if (window.ethereum && window.ethereum.isMetaMask) {
        await handleEthereumProvider(window.ethereum);
        hideWalletModal();
    } else {
        window.open('https://metamask.io/download.html', '_blank');
    }
}

// Connect WalletConnect
async function connectWalletConnect() {
    try {
        const WalletConnectProvider = window.WalletConnectProvider.default;
        const provider = new WalletConnectProvider({
            rpc: {
                56: "https://bsc-dataseed.binance.org/",
                97: "https://data-seed-prebsc-1-s1.binance.org:8545/"
            }
        });
        
        await provider.enable();
        web3 = new Web3(provider);
        accounts = await web3.eth.getAccounts();
        currentChainId = await web3.eth.getChainId();
        
        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider.on("disconnect", handleDisconnect);
        
        updateUI();
        hideWalletModal();
        
    } catch (error) {
        console.error("WalletConnect error:", error);
        alert("Error connecting with WalletConnect");
    }
}

// Connect Coinbase Wallet
async function connectCoinbaseWallet() {
    if (window.ethereum && window.ethereum.isCoinbaseWallet) {
        await handleEthereumProvider(window.ethereum);
        hideWalletModal();
    } else {
        window.open('https://www.coinbase.com/wallet', '_blank');
    }
}

// Handle account changes
function handleAccountsChanged(newAccounts) {
    accounts = newAccounts;
    updateUI();
}

// Handle chain changes
function handleChainChanged(chainId) {
    currentChainId = parseInt(chainId, 16);
    if (!FLUFFI_CONFIG.supportedChains[currentChainId]) {
        alert(`Please switch to ${Object.values(FLUFFI_CONFIG.supportedChains).join(" or ")}`);
    }
    window.location.reload();
}

// Handle WalletConnect disconnect
function handleDisconnect() {
    accounts = [];
    updateUI();
    showWalletModal();
}

// Switch to supported chain
async function switchToSupportedChain(provider) {
    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }] // BSC mainnet
        });
    } catch (error) {
        // If chain not added, add it
        if (error.code === 4902) {
            try {
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x38',
                        chainName: 'Binance Smart Chain',
                        nativeCurrency: {
                            name: 'BNB',
                            symbol: 'BNB',
                            decimals: 18
                        },
                        rpcUrls: ['https://bsc-dataseed.binance.org/'],
                        blockExplorerUrls: ['https://bscscan.com']
                    }]
                });
            } catch (addError) {
                console.error("Error adding BSC network:", addError);
            }
        }
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
    document.getElementById('connectWallet').addEventListener('click', showWalletModal);
    
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
        showWalletModal();
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
    const connectBtn = document.getElementById('connectWallet');
    
    if (accounts.length > 0) {
        const shortAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
        connectBtn.innerHTML = `<i class="fas fa-check"></i> ${shortAddress}`;
        
        if (walletInfo) {
            walletInfo.classList.remove('hidden');
            document.getElementById('walletAddress').textContent = shortAddress;
            document.getElementById('networkName').textContent = FLUFFI_CONFIG.supportedChains[currentChainId] || `Chain ID: ${currentChainId}`;
        }
    } else {
        connectBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
        if (walletInfo) walletInfo.classList.add('hidden');
    }
    
    // Update presale info
    document.getElementById('hardCap').textContent = FLUFFI_CONFIG.presale.hardCap + " BNB";
    document.getElementById('currentPrice').textContent = FLUFFI_CONFIG.presale.initialPrice + " BNB/FLUFFI";
    
    // Update staking info
    document.getElementById('apyValue').textContent = FLUFFI_CONFIG.staking.apy + "%";
}
// In your buyTokens function
async function buyTokens() {
    if (!accounts.length) {
        showWalletModal();
        return;
    }

    const amount = document.getElementById('buyAmount').value;
    if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    try {
        const paymentAddress = "0xFc3381a6AA1d134DDf22f641E97c92C400959910";
        
        // Verify the payment address matches what you expect
        console.log("Funds will be sent to:", paymentAddress);
        
        // Show confirmation to user
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

    } catch (error) {
        console.error("Payment failed:", error);
        alert("Payment failed: " + error.message);
    }
}
// Copy payment address to clipboard
document.getElementById('copyAddress').addEventListener('click', function() {
    const address = document.getElementById('paymentAddress').textContent;
    navigator.clipboard.writeText(address).then(() => {
        alert("Address copied to clipboard!");
    });
});
// Add to your buyTokens() function
const checksumAddress = web3.utils.toChecksumAddress(paymentAddress);
if (checksumAddress !== paymentAddress) {
    alert("Payment address validation failed!");
    return;
}
async function updateRaised() {
    const balance = await web3.eth.getBalance(paymentAddress);
    document.getElementById('raisedAmount').textContent = 
        web3.utils.fromWei(balance, 'ether') + " BNB";
}
// Add this near the top of your script.js
function verifyPaymentAddress() {
    const hardcodedAddress = "0xFc3381a6AA1d134DDf22f641E97c92C400959910";
    const displayedAddress = document.getElementById('paymentAddressDisplay').value;
    
    if (displayedAddress.toLowerCase() !== hardcodedAddress.toLowerCase()) {
        alert("SECURITY ALERT: Payment address mismatch detected!");
        document.getElementById('paymentAddressDisplay').value = hardcodedAddress;
    }
}

// Call this when the page loads
window.addEventListener('load', function() {
    verifyPaymentAddress();
});
