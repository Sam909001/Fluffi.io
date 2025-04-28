// Copy wallet address function
function copyWallet() {
  const walletInput = document.getElementById("wallet");
  walletInput.select();
  walletInput.setSelectionRange(0, 99999); // For mobile
  document.execCommand("copy");
  alert("Wallet address copied!");
}

// Countdown timer
const presaleEndDate = new Date("May 1, 2025 00:00:00").getTime();

const countdownInterval = setInterval(function () {
  const now = new Date().getTime();
  const timeRemaining = presaleEndDate - now;

  if (timeRemaining < 0) {
    clearInterval(countdownInterval);
    document.getElementById("countdown").innerHTML = "Presale has ended!";
    return;
  }

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML =
    days + "d " + hours + "h " + minutes + "
