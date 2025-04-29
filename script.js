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
