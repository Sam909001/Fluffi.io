<script>
  let userWalletAddress = null;
  const initialPrice = 0.0001;
  const stages = 15;
  const stageDuration = 1000 * 60 * 60 * 48;
  const startTime = Date.now();

  function updateStage() {
    const now = Date.now();
    const elapsed = now - startTime;
    const stage = Math.min(Math.floor(elapsed / stageDuration), stages - 1);
    const price = (initialPrice * Math.pow(1.05, stage)).toFixed(6);
    document.getElementById('stageInfo').textContent = `Stage: ${stage + 1} / ${stages}`;
    document.getElementById('priceInfo').textContent = `Price: $${price}`;
  }

  function updateCountdown() {
    const end = startTime + 30 * 24 * 60 * 60 * 1000;
    const left = end - Date.now();
    const days = Math.floor(left / (1000 * 60 * 60 * 24));
    const hours = Math.floor((left / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((left / (1000 * 60)) % 60);
    const seconds = Math.floor((left / 1000) % 60);
    document.getElementById('countdown').textContent = `Ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userWalletAddress = accounts[0];
        document.getElementById('walletButton').textContent = 'Connected';
      } catch (error) {
        alert('Wallet connection denied.');
      }
    } else {
      alert('MetaMask not detected.');
    }
  }

  function buyFluffi() {
    const amount = document.getElementById('amountInput').value;
    const ref = document.getElementById('refInput').value || localStorage.getItem('referrer') || 'none';
    if (!userWalletAddress) {
      alert('Please connect your wallet first.');
      return;
    }
    alert(`Buying $FLUFFI worth $${amount} with referral: ${ref}`);
  }

  function stakeFluffi() {
    const amount = document.getElementById('stakeInput').value;
    if (!userWalletAddress) {
      alert('Please connect your wallet first.');
      return;
    }
    alert(`Staking ${amount} $FLUFFI with 90% APY`);
  }

  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }

  // --- Referral Logic ---
  function getReferrerFromURL() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('referrer', ref);
    }
  }

  function applyReferralField() {
    const savedRef = localStorage.getItem('referrer');
    if (savedRef) {
      const refInput = document.getElementById('refInput');
      if (refInput) {
        refInput.value = savedRef;
      }
    }
  }

  // Initial setup
  getReferrerFromURL();
  applyReferralField();
  updateStage();
  updateCountdown();
  setInterval(() => {
    updateStage();
    updateCountdown();
  }, 1000);
</script>
