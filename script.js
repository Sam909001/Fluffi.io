const initialPrice = 0.0001;
const stages = 15;
const stageDuration = 1000 * 60 * 60 * 48; // 48 hours
const startTime = new Date("2025-05-05T12:00:00Z").getTime(); // fixed start time

function updateStage() {
  const now = Date.now();
  const elapsed = now - startTime;
  const stage = Math.min(Math.floor(elapsed / stageDuration), stages - 1);
  const price = (initialPrice * Math.pow(1.05, stage)).toFixed(6);
  document.getElementById('stageInfo').textContent = `Stage: ${stage + 1} / ${stages}`;
  document.getElementById('priceInfo').textContent = `Price: $${price}`;
}

function updateCountdown() {
  const end = startTime + 30 * 24 * 60 * 60 * 1000; // 30 days duration
  const left = end - Date.now();
  const days = Math.floor(left / (1000 * 60 * 60 * 24));
  const hours = Math.floor((left / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((left / (1000 * 60)) % 60);
  const seconds = Math.floor((left / 1000) % 60);
  document.getElementById('countdown').textContent = `Ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}
