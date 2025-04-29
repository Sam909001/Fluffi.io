/* script.js - Fluffi Presale & Staking Script */

let currentStage = 1;
const totalStages = 15;
const basePrice = 0.0001;
let tokensSold = 0;
const tokensPerStage = 4000000000 / totalStages;

function getCurrentPrice() {
  return +(basePrice * Math.pow(1.05, currentStage - 1)).toFixed(8);
}

function updateProgressBar() {
  const percent = (tokensSold / 4000000000) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

function simulatePurchase(amount) {
  const currentPrice = getCurrentPrice();
  const tokensToBuy = amount / currentPrice;
  if (tokensSold + tokensToBuy > currentStage * tokensPerStage) {
    if (currentStage < totalStages) {
      currentStage++;
      alert("Stage advanced to " + currentStage + ". New price: " + getCurrentPrice() + " BNB");
      simulatePurchase(amount); // recursively apply new stage price
    } else {
      alert("Presale is sold out!");
    }
  } else {
    tokensSold += tokensToBuy;
    updateProgressBar();
    alert(`You bought ${tokensToBuy.toFixed(2)} FLUFFI at ${currentPrice} BNB/token.`);
  }
}

document.getElementById("buyTokenBtn").addEventListener("click", () => {
  const buyAmount = prompt("Enter BNB amount to spend:");
  if (buyAmount && !isNaN(buyAmount)) {
    simulatePurchase(parseFloat(buyAmount));
  }
});

// Dark mode toggle
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Initial update
updateProgressBar();
<script>
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        document.getElementById('walletStatus').textContent = `Connected: ${walletAddress}`;
      } catch (error) {
        console.error("User rejected the request.");
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask extension.");
    }
  }
</script>
