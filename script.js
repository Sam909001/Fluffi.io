// Presale configuration
const totalStages = 15;
const initialPrice = 0.0001; // USD
const priceIncrease = 0.05;  // 5%
const tokensPerStage = 100000000; // Adjust as needed
const stageDuration = 60 * 5; // 5 minutes per stage

// Presale state
let currentStage = 1;
let tokensSold = 0;
let stageStartTime = Date.now();

function updatePresaleUI() {
  const price = (initialPrice * Math.pow(1 + priceIncrease, currentStage - 1)).toFixed(6);
  const totalSold = tokensPerStage * (currentStage - 1);
  const remaining = tokensPerStage;

  document.getElementById("current-stage").textContent = currentStage;
  document.getElementById("token-price").textContent = price;
  document.getElementById("tokens-sold").textContent = totalSold.toLocaleString();
  document.getElementById("tokens-remaining").textContent = remaining.toLocaleString();

  const elapsed = Math.floor((Date.now() - stageStartTime) / 1000);
  const remainingTime = Math.max(stageDuration - elapsed, 0);
  const mins = String(Math.floor(remainingTime / 60)).padStart(2, '0');
  const secs = String(remainingTime % 60).padStart(2, '0');
  document.getElementById("stage-timer").textContent = `${mins}:${secs}`;
  document.getElementById("stage-progress").value = ((elapsed / stageDuration) * 100);

  if (remainingTime === 0 && currentStage < totalStages) {
    currentStage++;
    tokensSold += tokensPerStage;
    stageStartTime = Date.now();
  }
}

function buyTokens() {
  alert("This is a demo. Integration with Web3 and Metamask goes here.");
  // You would handle the Web3 wallet transaction here
}

// Update the UI every second
setInterval(updatePresaleUI, 1000);
