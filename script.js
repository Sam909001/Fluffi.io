// script.js

let connected = false;

function connectWallet() {
  alert("This is a demo. Wallet connect functionality goes here.");
  connected = true;
}

function buyTokens() {
  if (!connected) {
    alert("Please connect your wallet first.");
    return;
  }
  const bnb = parseFloat(document.getElementById("bnbAmount").value);
  if (isNaN(bnb) || bnb <= 0) {
    alert("Enter a valid BNB amount.");
    return;
  }
  const soldElem = document.getElementById("soldAmount");
  let sold = parseInt(soldElem.textContent);
  const tokens = bnb / 0.0001;
  sold += tokens;
  soldElem.textContent = sold.toLocaleString();
  document.getElementById("progressBar").style.width = `${Math.min(100, sold / 4000000000 * 100)}%`;
  alert(`You bought ${tokens.toLocaleString()} FLUFFI!`);
}

function stakeFluffi() {
  const amount = parseFloat(document.getElementById("stakeAmount").value);
  if (isNaN(amount) || amount <= 0) {
    document.getElementById("stakeStatus").textContent = "Enter a valid amount.";
    return;
  }
  document.getElementById("stakeStatus").textContent = `You staked ${amount.toLocaleString()} FLUFFI until listing.`;
}

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
