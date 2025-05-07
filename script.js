// Use event delegation instead
document.body.addEventListener('click', (e) => {
  if (e.target.id === 'walletButton') {
    connectWallet();
  }
});
