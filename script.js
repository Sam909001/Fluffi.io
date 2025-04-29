<script>
  // Copy Wallet Address
  function copyWallet() {
    var copyText = document.getElementById("wallet");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    alert("Wallet Address Copied: " + copyText.value);
  }

  // Buy Now Function (Connect MetaMask + Send BNB)
  async function buyNow() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // Connect wallet
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        const transactionParameters = {
          to: '0xFc3381a6AA1d134DDf22f641E97c92C400959910', // Your wallet address
          from: accounts[0], // The user's account
          value: '100000000000000000', // Amount to send: 0.1 BNB (in wei)
        };

        const txHash = await ethereum
