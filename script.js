function copyWallet() {
  const walletInput = document.getElementById("wallet");
  walletInput.select();
  walletInput.setSelectionRange(0, 99999); // for mobile
  document.execCommand("copy");
  alert("Wallet address copied!");
}
// Set the end date for the presale (e.g., 8st May 2025)
var presaleEndDate = new Date("May 8, 2025 00:00:00").getTime();

// Update the countdown every 1 second
var countdownInterval = setInterval(function() {
  var now = new Date().getTime();
  var timeRemaining = presaleEndDate - now;

  // Time calculations for days, hours, minutes, and seconds
  var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  // Display the result in the HTML element
  document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

  // If the countdown is finished, display a message
  if (timeRemaining < 0) {
    clearInterval(countdownInterval);
    document.getElementById("countdown").innerHTML = "Presale has ended!";
  }
}, 1000);
