// Admin Configuration
const ADMIN_CONFIG = {
    contractAddress: "YOUR_PRESALE_CONTRACT_ADDRESS",
    paymentAddress: "0xFc3381a6AA1d134DDf22f641E97c92C400959910",
    bscscanAPIKey: "YOUR_BSCSCAN_API_KEY", // Get from https://bscscan.com/myapikey
    refreshInterval: 300000 // 5 minutes
};

// DOM Elements
const refreshBtn = document.getElementById('refreshData');

// Initialize
async function initAdminDashboard() {
    // Connect to Web3
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            window.web3 = new Web3(window.ethereum);
            loadData();
        } catch (error) {
            console.error("User denied access:", error);
        }
    } else {
        console.log("Non-Ethereum browser detected");
    }
    
    // Set up auto-refresh
    setInterval(loadData, ADMIN_CONFIG.refreshInterval);
    
    // Manual refresh button
    refreshBtn.addEventListener('click', loadData);
}

// Main data loader
async function loadData() {
    try {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Get contract balance
        const balance = await web3.eth.getBalance(ADMIN_CONFIG.paymentAddress);
        document.getElementById('contractBalance').textContent = web3.utils.fromWei(balance, 'ether');
        
        // Get recent transactions from BscScan API
        const txResponse = await fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${ADMIN_CONFIG.paymentAddress}&sort=desc&apikey=${ADMIN_CONFIG.bscscanAPIKey}`);
        const txData = await txResponse.json();
        
        if (txData.status === "1") {
            updateTransactionDisplay(txData.result);
        }
        
    } catch (error) {
        console.error("Error loading data:", error);
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
    }
}

// Update transaction display
function updateTransactionDisplay(transactions) {
    // Show last transaction
    if (transactions.length > 0) {
        const lastTx = transactions[0];
        document.getElementById('lastTx').textContent = 
            `${web3.utils.fromWei(lastTx.value, 'ether')} BNB at block ${lastTx.blockNumber}`;
    }
    
    // Show top contributors
    const contributorList = document.getElementById('contributorList');
    contributorList.innerHTML = '';
    
    // Group by contributor
    const contributors = {};
    transactions.forEach(tx => {
        if (!contributors[tx.from]) {
            contributors[tx.from] = 0;
        }
        contributors[tx.from] += parseFloat(web3.utils.fromWei(tx.value, 'ether'));
    });
    
    // Sort by contribution amount
    const sorted = Object.entries(contributors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10
    
    // Display
    sorted.forEach(([address, amount]) => {
        const shortAddress = `${address.substring(0, 6)}...${address.substring(38)}`;
        const contributorEl = document.createElement('div');
        contributorEl.innerHTML = `
            <p>${shortAddress}: <strong>${amount.toFixed(4)} BNB</strong></p>
        `;
        contributorList.appendChild(contributorEl);
    });
    
    document.getElementById('contributorCount').textContent = Object.keys(contributors).length;
}

// Initialize on load
window.addEventListener('load', initAdminDashboard);
