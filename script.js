function copyWallet() {
  const walletInput = document.getElementById("wallet");
  walletInput.select();
  walletInput.setSelectionRange(0, 99999); // for mobile
  document.execCommand("copy");
  alert("0xFc3381a6AA1d134DDf22f641E97c92C400959910!");
}
