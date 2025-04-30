document.addEventListener('DOMContentLoaded', function() {
    // Tokenomics Chart
    const ctx = document.getElementById('tokenomicsChart').getContext('2d');
    const tokenomicsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Presale (40%)', 'Liquidity (30%)', 'Staking (20%)', 'Marketing (5%)', 'Team (5%)'],
            datasets: [{
                data: [40, 30, 20, 5, 5],
                backgroundColor: [
                    'rgba(110, 69, 226, 0.8)',
                    'rgba(136, 211, 206, 0.8)',
                    'rgba(255, 126, 95, 0.8)',
                    'rgba(156, 39, 176, 0.8)',
                    'rgba(63, 81, 181, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });

    // Presale Timer and Stages
    const presaleDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const stageDuration = 2 * 24 * 60 * 60 * 1000; // 48 hours in milliseconds
    const totalStages = 15;
    const initialPrice = 0.0001;
    const priceIncreasePerStage = 0.05; // 5%
    
    // For demo purposes, we'll start the timer now
    const presaleStartTime = new Date().getTime();
    const presaleEndTime = presaleStartTime + presaleDuration;
    
    // Wallet connection
    const connectWalletBtn = document.getElementById('connectWallet');
    const walletOptions = document.querySelectorAll('.wallet-option');
    
    connectWalletBtn.addEventListener('click', function() {
        // In a real implementation, this would connect to the selected wallet
        alert('Wallet connection functionality would be implemented here based on the selected chain.');
    });
    
    walletOptions.forEach(option => {
        option.addEventListener('click', function() {
            const walletType = this.getAttribute('data-wallet');
            connectWalletBtn.textContent = `Connected (${walletType.toUpperCase()})`;
            connectWalletBtn.style.backgroundColor = '#4CAF50';
            // Hide wallet options after selection
            document.querySelector('.wallet-options').style.display = 'none';
        });
    });
    
    // Presale functionality
    const buyTokensBtn = document.getElementById('buyTokens');
    const buyAmountInput = document.getElementById('buyAmount');
    const referralCodeInput = document.getElementById('referralCode');
    const tokensSoldElement = document.getElementById('tokensSold');
    const fundsRaisedElement = document.getElementById('fundsRaised');
    
    let tokensSold = 0;
    let fundsRaised = 0;
    
    buyTokensBtn.addEventListener('click', function() {
        const amount = parseFloat(buyAmountInput.value);
        const referralCode = referralCodeInput.value.trim();
        
        if (isNaN(amount) {
            alert('Please enter a valid amount');
            return;
        }
        
        // Calculate tokens with possible referral bonus
        const currentPrice = parseFloat(document.getElementById('currentPrice').textContent);
        let tokens = amount / currentPrice;
        
        if (referralCode) {
            tokens *= 1.10; // 10% bonus
        }
        
        // Update stats
        tokensSold += tokens;
        fundsRaised += amount;
        
        tokensSoldElement.textContent = `${tokensSold.toLocaleString()} FLUFFI`;
        fundsRaisedElement.textContent = `${fundsRaised.toLocaleString()} USD`;
        
        // Show success message
        alert(`Successfully purchased ${tokens.toFixed(2)} FLUFFI tokens!`);
        
        // Reset form
        buyAmountInput.value = '';
        referralCodeInput.value = '';
    });
    
    // Staking functionality
    const stakeTokensBtn = document.getElementById('stakeTokens');
    const stakeAmountInput = document.getElementById('stakeAmount');
    const userStakedElement = document.getElementById('userStaked');
    const estimatedRewardsElement = document.getElementById('estimatedRewards');
    const totalStakedElement = document.getElementById('totalStaked');
    
    let userStaked = 0;
    let totalStaked = 0;
    
    stakeTokensBtn.addEventListener('click', function() {
        const amount = parseFloat(stakeAmountInput.value);
        
        if (isNaN(amount)) {
            alert('Please enter a valid amount');
            return;
        }
        
        // Update staking stats
        userStaked += amount;
        totalStaked += amount;
        
        userStakedElement.textContent = `${userStaked.toLocaleString()} FLUFFI`;
        totalStakedElement.textContent = `${totalStaked.toLocaleString()} FLUFFI`;
        
        // Calculate estimated rewards (90% APY)
        const daysUntilListing = 30; // Assuming listing is at the end of presale
        const dailyRewardRate = 0.9 / 365; // Daily interest rate
        const estimatedRewards = userStaked * dailyRewardRate * daysUntilListing;
        
        estimatedRewardsElement.textContent = `${estimatedRewards.toFixed(2)} FLUFFI`;
        
        // Show success message
        alert(`Successfully staked ${amount} FLUFFI tokens!`);
        
        // Reset form
        stakeAmountInput.value = '';
    });
    
    // Timer and stage calculation
    function updateTimer() {
        const now = new Date().getTime();
        const timeLeft = presaleEndTime - now;
        
        if (timeLeft <= 0) {
            // Presale ended
            document.querySelector('.timer').innerHTML = '<div class="timer-ended">Presale Ended!</div>';
            return;
        }
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update timer display
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Calculate current stage
        const timeElapsed = now - presaleStartTime;
        const currentStage = Math.min(Math.floor(timeElapsed / stageDuration) + 1, totalStages);
        const stageTimeLeftMs = stageDuration - (timeElapsed % stageDuration);
        
        // Calculate stage time left
        const stageHours = Math.floor(stageTimeLeftMs / (1000 * 60 * 60));
        const stageMinutes = Math.floor((stageTimeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
        const stageSeconds = Math.floor((stageTimeLeftMs % (1000 * 60)) / 1000);
        
        // Update stage info
        document.getElementById('currentStage').textContent = currentStage;
        document.getElementById('stageTimeLeft').textContent = 
            `${stageHours.toString().padStart(2, '0')}:${stageMinutes.toString().padStart(2, '0')}:${stageSeconds.toString().padStart(2, '0')}`;
        
        // Calculate current price
        const currentPrice = initialPrice * Math.pow(1 + priceIncreasePerStage, currentStage - 1);
        const nextStagePrice = currentPrice * (1 + priceIncreasePerStage);
        
        // Update price info
        document.getElementById('currentPrice').textContent = currentPrice.toFixed(6);
        document.getElementById('nextStagePrice').textContent = nextStagePrice.toFixed(6);
    }
    
    // Update timer every second
    updateTimer();
    setInterval(updateTimer, 1000);
});
