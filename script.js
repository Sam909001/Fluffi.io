// Contract addresses (replace with your actual contract addresses)
const TOKEN_ADDRESS = "0xYourTokenContractAddress";
const PRESALE_ADDRESS = "0xYourPresaleContractAddress";
const STAKING_ADDRESS = "0xYourStakingContractAddress";

// ABI - Simplified for demonstration (replace with your actual ABIs)
const TOKEN_ABI = [
    "function balanceOf(address) view returns (uint)",
    "function transfer(address, uint) returns (bool)",
    "function approve(address, uint) returns (bool)",
    "function allowance(address, address) view returns (uint)"
];

const PRESALE_ABI = [
    "function buyTokens() payable",
    "function raised() view returns (uint)",
    "function hardCap() view returns (uint)",
    "function rate() view returns (uint)",
    "function endTime() view returns (uint)"
];

const STAKING_ABI = [
    "function stake(uint amount)",
    "function unstake(uint amount)",
    "function claimRewards()",
    "function staked(address) view returns (uint)",
    "function rewards(address) view returns (uint)",
    "function apy() view returns (uint)"
];

let web3;
let provider;
let accounts = [];
let tokenContract;
let presaleContract;
let stakingContract;
let chainId;

// Initialize the application
window.addEventListener('load', async () => {
    await initWeb3();
    initContracts();
    setupEventListeners();
    updateUI();
    startCountdown();
});

async function initWeb3() {
    // Modern dapp browsers
    if (window.ethereum) {
        provider = window.ethereum;
        try {
            // Request account access
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', (newAccounts) => {
                accounts = newAccounts;
                updateUI();
            });
            
            // Listen for chain changes
            window.ethereum.on('chainChanged', (newChainId) => {
                window.location.reload();
            });
            
            chainId = await web3.eth.getChainId();
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
        // You could fall back to WalletConnect or other providers here
    }
}

function initContracts() {
    if (web3) {
        tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
        presaleContract = new web3.eth.Contract(PRESALE_ABI, PRESALE_ADDRESS);
        stakingContract = new web3.eth.Contract(STAKING_ABI, STAKING_ADDRESS);
    }
}

function setupEventListeners() {
    // Wallet connection
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Presale actions
    document.getElementById('buyTokens').addEventListener('click', buyTokens);
    document.getElementById('buyAmount').addEventListener('input', updateEstimatedTokens);
    
    // Staking actions
    document.getElementById('stakeTokens').addEventListener('click', stakeTokens);
    document.getElementById('unstakeTokens').addEventListener('click', unstakeTokens);
    document.getElementById('claimRewards').addEventListener('click', claimRewards);
}

async function connectWallet() {
    if (window.ethereum) {
        try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            updateUI();
        } catch (error) {
            console.error("Could not connect to wallet:", error);
        }
    } else {
        alert("Please install MetaMask or another Ethereum wallet to continue");
    }
}

async function updateUI() {
    if (accounts.length > 0) {
        document.getElementById('connectWallet').classList.add('hidden');
        const walletInfo = document.getElementById('walletInfo');
        walletInfo.classList.remove('hidden');
        
        // Shorten address for display
        const shortAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
        document.getElementById('walletAddress').textContent = shortAddress;
        
        // Get network name
        const networkId = await web3.eth.net.getId();
        const networkNames = {
            1: "Ethereum Mainnet",
            3: "Ropsten Testnet",
            4: "Rinkeby Testnet",
            5: "Goerli Testnet",
            42: "Kovan Testnet",
            56: "Binance Smart Chain",
            137: "Polygon",
            80001: "Mumbai Testnet"
        };
        document.getElementById('networkName').textContent = networkNames[networkId] || `Network ID: ${networkId}`;
        
        // Get ETH balance
        const balance = await web3.eth.getBalance(accounts[0]);
        const ethBalance = web3.utils.fromWei(balance, 'ether');
        document.getElementById('ethBalance').textContent = `${parseFloat(ethBalance).toFixed(4)} ETH`;
        
        // Update presale info
        updatePresaleInfo();
        
        // Update staking info if on staking tab
        if (document.getElementById('staking').classList.contains('active')) {
            updateStakingInfo();
        }
    } else {
        document.getElementById('connectWallet').classList.remove('hidden');
        document.getElementById('walletInfo').classList.add('hidden');
    }
}

async function updatePresaleInfo() {
    if (!presaleContract || !accounts.length) return;
    
    try {
        const raised = await presaleContract.methods.raised().call();
        const hardCap = await presaleContract.methods.hardCap().call();
        const rate = await presaleContract.methods.rate().call();
        
        const raisedEth = web3.utils.fromWei(raised, 'ether');
        const hardCapEth = web3.utils.fromWei(hardCap, 'ether');
        
        document.getElementById('raisedAmount').textContent = `${raisedEth} ETH`;
        document.getElementById('hardCap').textContent = `${hardCapEth} ETH`;
        document.getElementById('tokenPrice').textContent = `1 ETH = ${rate} MTK`;
        
        const progress = (raised / hardCap) * 100;
        document.getElementById('presaleProgress').style.width = `${progress}%`;
        document.getElementById('presaleProgressText').textContent = `${progress.toFixed(2)}%`;
    } catch (error) {
        console.error("Error updating presale info:", error);
    }
}

async function updateStakingInfo() {
    if (!stakingContract || !accounts.length) return;
    
    try {
        const staked = await stakingContract.methods.staked(accounts[0]).call();
        const rewards = await stakingContract.methods.rewards(accounts[0]).call();
        const apy = await stakingContract.methods.apy().call();
        
        document.getElementById('stakedAmount').textContent = `${web3.utils.fromWei(staked)} MTK`;
        document.getElementById('rewardAmount').textContent = `${web3.utils.fromWei(rewards)} MTK`;
        document.getElementById('apyValue').textContent = `${apy}%`;
    } catch (error) {
        console.error("Error updating staking info:", error);
    }
}

function updateEstimatedTokens() {
    const buyAmount = parseFloat(document.getElementById('buyAmount').value);
    if (isNaN(buyAmount)) {
        document.getElementById('estimatedTokens').textContent = "0 MTK";
        return;
    }
    
    // In a real app, you would get the rate from the contract
    const rate = 1000; // Example rate: 1 ETH = 1000 MTK
    const estimated = buyAmount * rate;
    document.getElementById('estimatedTokens').textContent = `${estimated} MTK`;
}

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
        const amountWei = web3.utils.toWei(amount, 'ether');
        
        await presaleContract.methods.buyTokens().send({
            from: accounts[0],
            value: amountWei
        });
        
        alert("Tokens purchased successfully!");
        updatePresaleInfo();
        document.getElementById('buyAmount').value = '';
    } catch (error) {
        console.error("Error buying tokens:", error);
        alert(`Error: ${error.message}`);
    }
}

async function stakeTokens() {
    if (!accounts.length) {
        alert("Please connect your wallet first");
        return;
    }
    
    const amount = document.getElementById('stakeAmount').value;
    if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    
    try {
        const amountWei = web3.utils.toWei(amount, 'ether');
        
        // First approve the staking contract to spend tokens
        await tokenContract.methods.approve(STAKING_ADDRESS, amountWei).send({
            from: accounts[0]
        });
        
        // Then stake the tokens
        await stakingContract.methods.stake(amountWei).send({
            from: accounts[0]
        });
        
        alert("Tokens staked successfully!");
        updateStakingInfo();
        document.getElementById('stakeAmount').value = '';
    } catch (error) {
        console.error("Error staking tokens:", error);
        alert(`Error: ${error.message}`);
    }
}

async function unstakeTokens() {
    if (!accounts.length) {
        alert("Please connect your wallet first");
        return;
    }
    
    const amount = document.getElementById('stakeAmount').value;
    if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    
    try {
        const amountWei = web3.utils.toWei(amount, 'ether');
        
        await stakingContract.methods.unstake(amountWei).send({
            from: accounts[0]
        });
        
        alert("Tokens unstaked successfully!");
        updateStakingInfo();
        document.getElementById('stakeAmount').value = '';
    } catch (error) {
        console.error("Error unstaking tokens:", error);
        alert(`Error: ${error.message}`);
    }
}

async function claimRewards() {
    if (!accounts.length) {
        alert("Please connect your wallet first");
        return;
    }
    
    try {
        await stakingContract.methods.claimRewards().send({
            from: accounts[0]
        });
        
        alert("Rewards claimed successfully!");
        updateStakingInfo();
    } catch (error) {
        console.error("Error claiming rewards:", error);
        alert(`Error: ${error.message}`);
    }
}

function startCountdown() {
    // In a real app, you would get the end time from the contract
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 7); // Example: 7 days from now
    
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) {
            clearInterval(timer);
            document.getElementById('presaleTimer').textContent = "Presale Ended";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('presaleTimer').textContent = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}
