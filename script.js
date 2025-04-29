// Copy wallet address function
function copyWallet() {
  const walletInput = document.getElementById("wallet");
  walletInput.select();
  walletInput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Wallet address copied!");
}

// Countdown timer logic
const presaleEndDate = new Date("May 1, 2025 00:00:00").getTime();

const countdownInterval = setInterval(function () {
  const now = new Date().getTime();
  const timeRemaining = presaleEndDate - now;

  if (timeRemaining < 0) {
    clearInterval(countdownInterval);
    document.getElementById("countdown").innerHTML = "Presale has ended!";
    return;
  }

  const days = Math.floor(timeRemaining / (1000
                                           <script>
  function buyNow() {
    alert("Connect your wallet manually and send BNB to: 0xFc3381a6AA1d134DDf22f641E97c92C400959910");
  }
</script>

