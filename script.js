// FLUFFI Configuration
const FLUFFI_CONFIG = {
    tokenAddress: "YOUR_FLUFFI_CONTRACT_ADDRESS",
    presaleAddress: "YOUR_PRESALE_CONTRACT_ADDRESS",
    stakingAddress: "YOUR_STAKING_CONTRACT_ADDRESS",
    paymentAddress: "0xFc3381a6AA1d134DDf22f641E97c92C400959910",
    stages: 15,
    currentStage: 1,
    stageDuration: 48 * 60 * 60, // 48 hours in seconds
    initialPrice: 0.0001,
    priceIncrease: 0.05 // 5%
};

// Initialize FLUFFI Platform
async function initFluffiPlatform() {
    await initWeb3();
    initContracts();
    setupEventListeners();
    updateUI();
    startStageCountdown();
    loadMemes();
    setupMascotInteraction();
}

// FLUFFI Specific Functions
function startStageCountdown() {
    const endTime = Date.now() + (FLUFFI_CONFIG.stageDuration * 1000);
    
    const timer = setInterval(() => {
        const now = Date.now();
        const distance = endTime - now;
        
        if (distance < 0) {
            clearInterval(timer);
            if (FLUFFI_CONFIG.currentStage < FLUFFI_CONFIG.stages) {
                FLUFFI_CONFIG.currentStage++;
                startStageCountdown();
            }
            return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('stageCountdown').textContent = 
            `${hours}h ${minutes}m ${seconds}s`;
        
        // Update current price
        const currentPrice = FLUFFI_CONFIG.initialPrice * 
                           Math.pow(1 + FLUFFI_CONFIG.priceIncrease, FLUFFI_CONFIG.currentStage - 1);
        document.getElementById('currentPrice').textContent = `${currentPrice.toFixed(6)} BNB`;
        document.getElementById('currentStage').textContent = 
            `${FLUFFI_CONFIG.currentStage}/${FLUFFI_CONFIG.stages}`;
    }, 1000);
}

function loadMemes() {
    // In a real implementation, this would fetch from an API or IPFS
    const memeContainer = document.getElementById('memeGallery');
    const memeUrls = [
        'memes/meme1.jpg',
        'memes/meme2.jpg',
        'memes/meme3.jpg'
    ];
    
    memeUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = "FLUFFI Meme";
        memeContainer.appendChild(img);
    });
}

function setupMascotInteraction() {
    const mascot = document.getElementById('mascotImage');
    const message = document.getElementById('mascotMessage');
    
    mascot.addEventListener('click', () => {
        message.classList.toggle('hidden');
        
        // Random messages
        const messages = [
            "FLUFFI to the moon!",
            "Stake for 90% APY!",
            "Refer friends for 10% bonus!",
            "Woof woof! Buy FLUFFI!"
        ];
        message.textContent = messages[Math.floor(Math.random() * messages.length)];
        
        // Add bounce animation
        mascot.style.animation = 'bounce 0.5s';
        setTimeout(() => {
            mascot.style.animation = '';
        }, 500);
    });
}

// Initialize when page loads
window.addEventListener('load', initFluffiPlatform);
