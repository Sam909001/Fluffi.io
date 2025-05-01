<script>
  const initialPrice = 0.0001;
  const stages = 15;
  const stageDuration = 1000 * 60 * 60 * 48; // 48 hours
  const presaleDuration = 1000 * 60 * 60 * 24 * 30; // 30 days

  // Set your fixed presale start date
  const startTime = new Date("2025-05-05T00:00:00Z").getTime();

  function updateStage() {
    const now = Date.now();
    const elapsed = now - startTime;
    const stage = Math.min(Math.floor(elapsed / stageDuration), stages - 1);
    const price = (initialPrice * Math.pow(1.05, stage)).toFixed(6);
    document.getElementById('stageInfo').textContent = `Stage: ${stage + 1} / ${stages}`;
    document.getElementById('priceInfo').textContent = `Price: $${price}`;
  }

  function updateCountdown() {
    const now = Date.now();
    const endTime = startTime + presaleDuration;
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      document.getElementById('countdown').textContent = "Presale Ended";
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    document.getElementById('countdown').textContent = `Ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  // Initial call
  updateStage();
  updateCountdown();

  // Continuous updates
  setInterval(() => {
    updateStage();
    updateCountdown();
  }, 1000);
</script>
