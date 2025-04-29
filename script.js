// script.js

async function copyWallet() {
  const walletInput = document.getElementById("wallet");
  walletInput.select();
  document.execCommand("copy");
  alert("Wallet address copied to clipboard!");
}

const presaleWallet = "0xFc3381a6AA1d134DDf22f641E97c92C400959910";
const stages = 15;
const initialPrice = 0.0001;
const totalTokens = 4000000000;
let tokensSold = 0;
const stageLength = 60 * 60 * 24;
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

async function buyTokens() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed!');
    return;
  }

  const bnbAmount = parseFloat(document.getElementById('bnbAmount').value);
  if (isNaN(bnbAmount) || bnbAmount < 0.1 || bnbAmount > 5) {
    alert('Enter a valid BNB amount between 0.1 and 5.');
    return;
  }

  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const sender = accounts[0];
  const recipient = '0xFc3381a6AA1d134DDf22f641E97c92C400959910';

  try {
    await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: sender,
        to: recipient,
        value: (bnbAmount * 1e18).toString(16),
        gas: '21000'
      }]
    });
    alert('Transaction sent! Thank you for participating in the presale!');
  } catch (error) {
    console.error(error);
    alert('Transaction failed.');
  }
}
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    const amountInBNB = prompt("Enter amount in BNB to send:", "0.1");

    if (!amountInBNB || isNaN(amountInBNB)) return;

    const amountInWei = BigInt(Number(amountInBNB) * 1e18).toString();

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: account,
          to: presaleWallet,
          value: "0x" + BigInt(amountInWei).toString(16)
        }
      ]
    });

    tokensSold += Math.floor((Number(amountInBNB) / getTokenPrice(getCurrentStage())));
    updatePresaleUI();
    alert("Transaction sent successfully!");
  } catch (error) {
    console.error(error);
    alert("Transaction failed or cancelled.");
  }
}

setInterval(updatePresaleUI, 1000);
updatePresaleUI();
function generateReferralLink() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed!');
    return;
  }

  ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
    const address = accounts[0];
    const link = `${window.location.origin}?ref=${address}`;
    const referralText = document.getElementById('referralLink');
    referralText.innerText = link;
  });
}
const presaleStart = new Date("2025-05-05T00:00:00Z"); // UTC time
const stageDurationMs = 24 * 60 * 60 * 1000; // 24 hours
const totalStages = 15;

function updateTimer() {
  const now = new Date();
  const countdownEl = document.getElementById("presaleCountdown");
  const statusEl = document.getElementById("presaleStatus");
  const stageInfoEl = document.getElementById("stageInfo");

  if (now < presaleStart) {
    const diff = presaleStart - now;
    countdownEl.textContent = formatTime(diff);
    statusEl.textContent = "Presale starts in:";
    stageInfoEl.textContent = "";
  } else {
    const timeSinceStart = now - presaleStart;
    const stageNumber = Math.min(Math.floor(timeSinceStart / stageDurationMs) + 1, totalStages);
    const stageEnd = new Date(presaleStart.getTime() + stageNumber * stageDurationMs);
    const timeLeft = stageEnd - now;

    statusEl.textContent = "Presale is live!";
    countdownEl.textContent = `Time left in stage ${stageNumber}: ${formatTime(timeLeft)}`;
    stageInfoEl.textContent = `Stage ${stageNumber} of ${totalStages}`;
  }
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateTimer, 1000);
updateTimer();
<script src="script.js"></script>
// Capture referrer from URL
const urlParams = new URLSearchParams(window.location.search);
const ref = urlParams.get('ref');
if (ref && /^0x[a-fA-F0-9]{40}$/.test(ref)) {
  localStorage.setItem('referrer', ref);
  console.log("Referrer saved:", ref);
}

// Simulated referral data (you can replace this with real backend logic later)
const referralData = {
  "0xAbc1234567890000000000000000000000000000": 4,
  "0xDef4567890000000000000000000000000000000": 3,
  "0xGhi7890000000000000000000000000000000000": 2,
};

// Render leaderboard
function updateLeaderboard() {
  const tbody = document.querySelector('#refTable tbody');
  tbody.innerHTML = '';
  for (const [wallet, count] of Object.entries(referralData)) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="padding: 8px;">${wallet.slice(0, 6)}...${wallet.slice(-4)}</td>
      <td style="padding: 8px;">${count}</td>
    `;
    tbody.appendChild(row);
  }
}
updateLeaderboard();
function buyToken() {
  const referrer = localStorage.getItem('referrer') || 'none';
  alert(`Buy Token clicked.\nReferrer: ${referrer}\n\n(This is a demo — connect wallet logic goes here.)`);

  // Optional future integration:
  // Send referral info to backend or pass to smart contract
}
function handleEmailSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('emailInput').value;
  document.getElementById('emailMessage').textContent = "Thank you! You're on the Fluffi list 🐶";

  // Simulate storing email (replace with API or backend call)
  console.log("Email captured:", email);

  // Optional: clear the form
  document.getElementById('emailInput').value = '';
}
// Simulated data — you can replace this with live values from your backend
const totalTokens = 4000000000;
let tokensSold = 1580000000;
let participants = 125;

function updateStats() {
  const percentSold = (tokensSold / totalTokens) * 100;

  document.getElementById("participantsCount").textContent = participants;
  document.getElementById("tokensSold").textContent = tokensSold.toLocaleString();
  document.getElementById("progressBar").style.width = percentSold + "%";
}

// Optional: auto-refresh every few seconds (simulate dynamic updates)
setInterval(() => {
  // Fake growth for demo purposes
  tokensSold += Math.floor(Math.random() * 1000000); 
  participants += Math.floor(Math.random() * 3);
  if (tokensSold > totalTokens) tokensSold = totalTokens;
  updateStats();
}, 5000);

updateStats(); // Initial call
