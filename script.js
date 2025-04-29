// script.js

function copyWallet() {
  const walletInput = document.getElementById("wallet");
  walletInput.select();
  document.execCommand("copy");
  alert("Wallet address copied to clipboard!");
}

// Presale stages config
const stages = 15;
const initialPrice = 0.0001;
const totalTokens = 4000000000;
let tokensSold = 0;
const stageLength = 60 * 60 * 24; // 1 day in seconds
const startTime = Date.now();

function getCurrentStage() {
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startTime) / 1000);
  return Math.min(Math.floor(elapsedSeconds / stageLength), stages - 1);
}

function getTokenPrice(stage) {
  return (initialPrice * Math.pow(1.05, stage)).toFixed(8);
}

function updatePresaleUI() {
  const currentStage = getCurrentStage();
  const price = getTokenPrice(currentStage);
  const tokensPerStage = totalTokens / stages;
  const tokensRemaining = Math.max(0, tokensPerStage - (tokensSold % tokensPerStage));
  const stageProgress = ((tokensSold % tokensPerStage) / tokensPerStage) * 100;
  const secondsLeft = stageLength - Math.floor((Date.now() - startTime) / 1000) % stageLength;

  document.getElementById("current-stage").textContent = currentStage + 1;
  document.getElementById("token-price").textContent = price;
  document.getElementById("tokens-sold").textContent = tokensSold.toLocaleString();
  document.getElementById("tokens-remaining").textContent = Math.floor(tokensRemaining).toLocaleString();
  document.getElementById("stage-progress").value = stageProgress;
  document.getElementById("stage-timer").textContent = formatTime(secondsLeft);
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function buyTokens() {
  alert("This is a demo. Connect to Web3 to enable real transactions.");
  tokensSold += 10000000; // Simulate token purchase
  updatePresaleUI();
}

setInterval(updatePresaleUI, 1000);
updatePresaleUI();
