// FLUFFI Configuration
const FLUFFI_CONFIG = {
    token: {
        name: "FLUFFI",
        symbol: "FLUFFI",
        decimals: 18,
        totalSupply: 10000000000,
        address: "YOUR_TOKEN_CONTRACT_ADDRESS",
        abi: [] // Your token ABI would go here
    },
    presale: {
        address: "YOUR_PRESALE_CONTRACT_ADDRESS",
        abi: [], // Your presale ABI would go here
        hardCap: 150, // BNB
        softCap: 50, // BNB
        initialPrice: 0.0001, // BNB per FLUFFI
        listingPrice: 0.002, // BNB per FLUFFI
        stages: 15,
        stageDuration: 48 * 60 * 60 * 1000, // 48 hours in ms
        priceIncrease: 0.05, // 5% per stage
        paymentAddress: "0xFc3381a6AA1d134DDf22f641E97c92C400959910",
        acceptedTokens: ["BNB", "ETH", "SOL"]
    },
    staking: {
        address: "YOUR_STAKING_CONTRACT_ADDRESS",
        abi: [], // Your staking ABI would go here
        apy: 90, // 90% APY
        referralRate: 10 // 10% referral bonus
    },
    social: {
        twitter: "https://twitter.com/FLUFFIOFFICIAL",
        telegram: "https://t.me/FLUFFISOLANALAYER2"
    }
};

// Global Variables
let web3;
let accounts = [];
let currentNetwork;
let fluffiToken;
let fluffiPresale;
let fluffiStaking;
let currentStage = 1;
let stageEndTime;

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const buyTokensBtn = document.getElementById('buyTokens');
const stakeTokensBtn = document.getElementById('stakeTokens');
const unstakeTokensBtn = document.getElementById('unstakeTokens');
const claimRewardsBtn = document.getElementById('claimRewards');
const applyReferralBtn = document.getElementById('applyReferral');
const copyReferralBtn = document.getElementById('copyReferral');
const copyContractBtn = document.getElementById('copyContract');
const mascot = document.getElementById('mascot');
const mascotMessage = document.getElementById('mascotMessage');

// Initialize Application
window.addEventListener('load', async () => {
    await initWeb3();
    initEventListeners();
    updateUI();
    startStageCountdown();
    loadMemes();
    setupMascot();
    
    // Show welcome message
    showMascotMessage("Welcome to FLUFFI! 🐶");
});

// Initialize Web3
async function initWeb3() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Get current accounts
            accounts = await web3.eth.getAccounts();
            
            // Get current network
            currentNetwork = await web3.eth.net.getId();
            
            // Initialize contracts
            initContracts();
            
            // Set up event listeners for account changes
            window.ethereum.on('accountsChanged', (newAccounts) => {
                accounts = newAccounts;
                updateUI();
            });
            
            // Set up event listeners for chain changes
            window.ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });
            
        } catch (error) {
            console.error("Error initializing Web3:", error);
            showMascotMessage("Error connecting wallet! 😢");
        }
    } else {
        showMascotMessage("Please install MetaMask! 🦊");
        console.log("Please install MetaMask or another Web3 provider.");
    }
}

// Initialize Contracts
function initContracts() {
    if (!web3) return;
    
    // Initialize Token Contract
    fluffiToken = new web3.eth.Contract(
        FLUFFI_CONFIG.token.abi,
        FLUFFI_CONFIG.token.address
    );
    
    // Initialize Presale Contract
    fluffiPresale = new web3.eth.Contract(
        FLUFFI_CONFIG.presale.abi,
        FLUFFI_CONFIG.presale.address
    );
    
    // Initialize Staking Contract
    fluffiStaking = new web3.eth.Contract(
        FLUFFI_CONFIG.staking.abi,
        FLUFFI_CONFIG.staking.address
    );
}

// Initialize Event Listeners
function initEventListeners() {
    // Wallet Connection
    connectWalletBtn.addEventListener('click', connectWallet);
    
    // Tab Navigation
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Presale Actions
    buyTokensBtn.addEventListener('click', buyTokens);
    document.getElementById('buyAmount').addEventListener('input', updateEstimatedTokens);
    
    // Staking Actions
    stakeTokensBtn.addEventListener('click', stakeTokens);
    unstakeTokensBtn.addEventListener('click', unstakeTokens);
    claimRewardsBtn.addEventListener('click', claimRewards);
    
    // Referral System
    applyReferralBtn.addEventListener('click', applyReferral);
    copyReferralBtn.addEventListener('click', copyReferralLink);
    copyContractBtn.addEventListener('click', copyContractAddress);
}

// Connect Wallet
async function connectWallet() {
    if (!window.ethereum) {
        showMascotMessage("Install MetaMask first! 🦊");
        window.open("https://metamask.io/", "_blank");
        return;
    }
    
    try {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        showMascotMessage("Wallet connected! 🎉");
        updateUI();
    } catch (error) {
        console.error("Error connecting wallet:", error);
        showMascotMessage("Connection failed! 😢");
    }
}

// Update UI
async function updateUI() {
    if (accounts.length > 0) {
        // Update wallet connection status
        connectWalletBtn.classList.add('hidden');
        document.getElementById('walletInfo').classList.remove('hidden');
        
        // Shorten address for display
        const shortAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
        document.getElementById('walletAddress').textContent = shortAddress;
        
        // Update contract address display
        document.getElementById('contractAddress').textContent = FLUFFI_CONFIG.token.address;
        
        // Update referral link
        updateReferralLink();
        
        // Load data based on active tab
        const activeTab = document.querySelector('.tab-content.active').id;
        if (activeTab === 'presale') {
            updatePresaleInfo();
        } else if (activeTab === 'staking') {
            updateStakingInfo();
        }
    } else {
        connectWalletBtn.classList.remove('hidden');
        document.getElementById('walletInfo').classList.add('hidden');
    }
}

// Switch Tabs
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    
    // Update data for the active tab
    if (tabId === 'presale') {
        updatePresaleInfo();
    } else if (tabId === 'staking') {
        updateStakingInfo();
    }
}

// Update Presale Info
async function updatePresaleInfo() {
    if (!fluffiPresale || !accounts.length) return;
    
    try {
        // Get presale stats
        const raised = await fluffiPresale.methods.raised().call();
        const hardCap = await fluffiPresale.methods.hardCap().call();
        const userContribution = await fluffiPresale.methods.contributions(accounts[0]).call();
        
        // Convert from wei
        const raisedBNB = web3.utils.fromWei(raised, 'ether');
        const hardCapBNB = web3.utils.fromWei(hardCap, 'ether');
        const userContributionBNB = web3.utils.fromWei(userContribution, 'ether');
        
        // Update DOM
        document.getElementById('raisedAmount').textContent = `${parseFloat(raisedBNB).toFixed(4)} BNB`;
        document.getElementById('hardCap').textContent = `${parseFloat(hardCapBNB).toFixed(4)} BNB`;
        document.getElementById('userContribution').textContent = `${parseFloat(userContributionBNB).toFixed(4)} BNB`;
        
        // Update progress bar
        const progress = (raised / hardCap) * 100;
        document.getElementById('presaleProgress').style.width = `${progress}%`;
        document.getElementById('presaleProgressText').textContent = `${progress.toFixed(2)}%`;
        
    } catch (error) {
        console.error("Error updating presale info:", error);
    }
}

// Update Staking Info
async function updateStakingInfo() {
    if (!fluffiStaking || !accounts.length) return;
    
    try {
        // Get staking stats
        const staked = await fluffiStaking.methods.staked(accounts[0]).call();
        const rewards = await fluffiStaking.methods.rewards(accounts[0]).call();
        const totalStaked = await fluffiStaking.methods.totalStaked().call();
        
        // Convert from wei
        const stakedFLUFFI = web3.utils.fromWei(staked, 'ether');
        const rewardsFLUFFI = web3.utils.fromWei(rewards, 'ether');
        const totalStakedFLUFFI = web3.utils.fromWei(totalStaked, 'ether');
        
        // Update DOM
        document.getElementById('stakedAmount').textContent = `${parseFloat(stakedFLUFFI).toFixed(2)} FLUFFI`;
        document.getElementById('rewardAmount').textContent = `${parseFloat(rewardsFLUFFI).toFixed(2)} FLUFFI`;
        document.getElementById('totalStaked').textContent = `${parseFloat(totalStakedFLUFFI).toFixed(2)} FLUFFI`;
        
    } catch (error) {
        console.error("Error updating staking info:", error);
    }
}

// Start Stage Countdown
function startStageCountdown() {
    stageEndTime = Date.now() + FLUFFI_CONFIG.presale.stageDuration;
    
    const timer = setInterval(() => {
        const now = Date.now();
        const distance = stageEndTime - now;
        
        if (distance < 0) {
            // Move to next stage
            if (currentStage
