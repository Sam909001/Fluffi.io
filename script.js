function copyWallet() {
  const walletInput = document.getElementById("wallet");
  walletInput.select();
  walletInput.setSelectionRange(0, 99999); // for mobile
  document.execCommand("copy");
  alert("Wallet address copied!");
}
