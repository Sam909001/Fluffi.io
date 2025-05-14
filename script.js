// FLUFFI Presale & Staking Full Script
// -------- Dark Mode ----------
(function () {
  const toggle = document.getElementById('darkToggle');
  function setDarkMode(on) {
    document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
    window.localStorage.setItem('fluffi_theme', on ? 'dark' : 'light');
  }
  const stored = window.localStorage.getItem('fluffi_theme');
  if (stored) setDarkMode(stored === 'dark');
  toggle.onclick = function () {
    const next = document.documentElement.getAttribute('data-theme') !== 'dark';
    setDarkMode(next);
  };
})();

// -------- Global Presale/Tokenomics Settings ----------
const TOTAL_SUPPLY = 10_000_000_000;
const PRESALE_START = Date.now(); // when script loads
const PRESALE_LENGTH_MS = 30 * 24 * 60 * 60 * 1000;
const PRESALE_END = PRESALE_START + PRESALE_LENGTH_MS;
const STAGE_COUNT = 15;
const STAGE_MS = (30 * 24 * 60 * 60 * 1000) / STAGE_COUNT;
const INITIAL_PRICE = 0.0001; // USD
const PRICE_STEP = 1.05; // 5% increase per stage
const LISTING_PRICE = 0.002;
const PAYMENT_ADDRESS = "0x6F5f48A159Cd46a10faDEED95b29028972554747";
const PRESALE_CONTRACT = "0x60A94bc12d0d4F782Fd597e5E1222247CFb7E297"; // BSC testnet
// ABI (from user):
const PRESALE_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"}],"name":"Contribution","type":"event"},
  {"anonymous":false,"inputs":[],"name":"PresaleEnded","type":"event"},
  {"inputs":[],"name":"RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"endPresale","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getContributorAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"presaleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrals","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"setTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"stateMutability":"payable","type":"receive"}
];

// ------------- Helper functions ---------------
function fmt(x, d=4) {
  return Number(x).toLocaleString(undefined, {maximumFractionDigits:d});
}
function now() {
  return Date.now();
}
function ms2dhms(ms) {
  if (ms <= 0) return "00d 00h 00m 00s";
  let d = Math.floor(ms/86400000), h=Math.floor((ms%86400000)/3600000), m=Math.floor((ms%3600000)/60000), s=Math.floor((ms%60000)/1000);
  return `${d.toString().padStart(2,'0')}d ${h.toString().padStart(2,'0')}h ${m.toString().padStart(2,'0')}m ${s.toString().padStart(2,'0')}s`;
}

// ------------- Presale State Logic ---------------
function getPresaleStage() {
  let t = now() - PRESALE_START;
  return Math.min(STAGE_COUNT-1, Math.floor(t / STAGE_MS));
}
function getStageEnds() {
  let stage = getPresaleStage();
  return PRESALE_START + (stage+1)*STAGE_MS;
}
function getPresaleActive() {
  return now() < PRESALE_END;
}
function getPriceForStage(stage) {
  return +(INITIAL_PRICE * Math.pow(PRICE_STEP, stage)).toFixed(8);
}
function getCurrentPrice() {
  return getPriceForStage(getPresaleStage());
}
// referral: use ?ref=address in url
function getReferredBy() {
  try {
    const url = new URL(window.location.href);
    let ref = url.searchParams.get('ref');
    if (typeof ref === 'string' && /^0x[a-fA-F0-9]{40}$/.test(ref)) return ref;
  } catch {}
  return null;
}

// -------------- UI Updates: Timers, Stages ------------
function updatePresaleUI() {
  let timerDiv = document.getElementById('presale-timer');
  let stage = getPresaleStage();
  let ends = getStageEnds();
  let presaleEnds = PRESALE_END;
  let stageTimeLeft = Math.max(0, ends-now());
  let presaleTimeLeft = Math.max(0, presaleEnds-now());
  let price = getCurrentPrice();
  let raised = window._presaleRaised || 0;
  let stageInfo = `<b>Stage:</b> ${stage+1} / 15 &nbsp; (<span id='stage-timer'>${ms2dhms(stageTimeLeft)}</span> left) <br> <b>Price:</b> $${fmt(price,6)} per FLUFFI <br> <b>Presale Ends:</b> <span id='presale-fulltimer'>${ms2dhms(presaleTimeLeft)}</span> <br> <b>Total Raised:</b> ${fmt(raised,2)} USD`;
  document.getElementById('presale-stage-info').innerHTML = stageInfo;
  timerDiv.innerHTML = `<div style='font-size:1.3rem;'><b>Current Price:</b> $${fmt(price,6)} <span style='opacity:0.6'>(auto-increases every 48h)</span></div>`;
  // claim section enable/disable
  const claimDiv = document.getElementById('presale-claim');
  if (now() > PRESALE_END) claimDiv.style.display = 'block';
  else claimDiv.style.display = 'none';
}
setInterval(updatePresaleUI, 1000);
window.addEventListener('DOMContentLoaded', updatePresaleUI);

// -------------- Referral Logic --------------
(function(){
  const refInput = document.getElementById('referral-code');
  const myRefLinkDiv = document.getElementById('presale-ref-link');
  // Try detect if user has connected wallet and show their ref link (once connected)
  function showReferralLink(addr) {
    let base = window.location.origin + window.location.pathname;
    let refLink = `${base}?ref=${addr}`;
    myRefLinkDiv.innerHTML = `<b>Your Referral Link:</b> <input style='width:230px' value='${refLink}' readonly> <button onclick='navigator.clipboard.writeText("${refLink}")'>Copy</button> <span style='color:#25ca64'>+10% Bonus</span>`;
  }
  window.showReferralLink = showReferralLink;
  // Pre-fill referral code from ?ref
  const referred = getReferredBy();
  if (referred) refInput.value = referred;
})();

// -------------- Wallet Connect (BNB/Eth/Sol) --------------
let currentAccount = null;
let provider = null;
let web3 = null; // for MetaMask/etc
async function connectWallet(ev, forStaking=false) {
  ev.preventDefault();
  if (!window.ethereum) {
    alert("MetaMask wallet not detected! Please install or enable your wallet."); return;
  }
  provider = window.ethereum;
  try {
    let accounts = await provider.request({ method: 'eth_requestAccounts' });
    currentAccount = accounts[0];
    showReferralLink(currentAccount);
    document.getElementById(forStaking ? 'connect-wallet-stake' : 'connect-wallet').innerText = currentAccount.slice(0,6) + '...' + currentAccount.slice(-4);
    // auto switch to BSC testnet if needed
    const BSC_CHAIN_ID = '0x61';
    try { await provider.request({method:'wallet_switchEthereumChain',params:[{chainId:BSC_CHAIN_ID}]}); } catch(e) {}
    window.ethereum.on('accountsChanged',()=>window.location.reload());
    return currentAccount;
  } catch (e) {
    alert("Wallet connect failed: "+(e.message||e));
    return null;
  }
}

// Placeholder for Solana wallet/modal
function showSolanaComing() {
  alert('Solana wallet support coming soon! Use MetaMask for BNB.');
}

// -------------- Presale Buy & Contract Logic (BSC testnet only) --------------
async function buyTokens(ev) {
  ev.preventDefault();
  if (!window.ethereum) return alert('MetaMask required for buy.');
  await connectWallet(ev);
  // web3.js contract call
  if (typeof window.Web3 === 'undefined') {
    alert('Web3.js not detected!'); return;
  }
  let amount = parseFloat(document.getElementById('presale-amount').value);
  let ref = document.getElementById('referral-code').value.trim();
  let refAddr = ref && /^0x[a-fA-F0-9]{40}$/.test(ref) ? ref : '0x0000000000000000000000000000000000000000';
  if (!(amount > 0)) return alert('Enter a valid amount!');
  let stage = getPresaleStage();
  let price = getPriceForStage(stage);
  let usd = amount * price;
  // convert USD to BNB at static rate, simulated (e.g. $500 = X BNB). Ideally fetch live conversion rate.
  // Let's simulate 1 BNB = $500
  let BNB_USD = 500;
  let bnbValue = usd / BNB_USD;
  // Contract interaction
  const contract = new window.Web3(window.ethereum).eth.Contract(PRESALE_ABI, PRESALE_CONTRACT);
  document.getElementById('connect-wallet').disabled = true;
  document.getElementById('connect-wallet').innerText = 'Processing...';
  try {
    await contract.methods.contribute(refAddr).send({ from: currentAccount, value: window.Web3.utils.toWei(bnbValue.toString(), 'ether') });
    alert('Success! You joined the FLUFFI presale.');
    window.showReferralLink(currentAccount);
    document.getElementById('presale-form').reset();
  } catch (e) {
    alert('Transaction failed or canceled: '+(e.message||e));
  } finally {
    document.getElementById('connect-wallet').disabled = false;
    document.getElementById('connect-wallet').innerText = currentAccount.slice(0,6)+'...'+currentAccount.slice(-4);
  }
}
// attach
document.getElementById('presale-form').onsubmit = buyTokens;

// -------------- Claim Token (after presale) --------------
document.getElementById('claim-tokens').onclick = function() {
  if (now() < PRESALE_END) return alert('Claim available after presale ends!');
  if (!currentAccount) return alert('Connect your wallet to claim!');
  alert('Tokens will be distributed to all buyers after presale by the FLUFFI team. Watch Telegram for claim instructions.');
};

// -------------- Staking (UI side, simulated) --------------
let staked = 0, stakedAt = 0, stakingRewards = 0;
function updateStakingUI() {
  let timerDiv = document.getElementById('staking-timer');
  let left = Math.max(0, PRESALE_END-now());
  timerDiv.innerHTML = '<b>Staking Ends:</b> ' + ms2dhms(left);
  let rewards = 0;
  if (stakedAt && staked > 0) {
    // 90% APY, simple calculation
    let secs = Math.max(0, (Math.min(now(), PRESALE_END) - stakedAt)/1000);
    rewards = staked * Math.pow(1 + 0.90/365/24/3600, secs) - staked;
  }
  stakingRewards = rewards;
  document.getElementById('staking-apr').innerHTML = `APY: <b>90%</b> <br> <span style='color:#15b83f;'>Your rewards: ${fmt(rewards,4)}</span>`;
  const claimDiv = document.getElementById('staking-claim');
  if (now() > PRESALE_END && staked > 0) claimDiv.style.display = 'block';
  else claimDiv.style.display = 'none';
}
setInterval(updateStakingUI, 1500);
document.getElementById('staking-form').onsubmit = async function(ev) {
  ev.preventDefault();
  if (!currentAccount) {
    await connectWallet(ev, true);
    if (!currentAccount) return;
  }
  let amt = parseFloat(document.getElementById('stake-amount').value);
  if (!(amt > 0)) return alert('Enter a valid stake!');
  // just simulate - record in local/session storage
  staked = (window.localStorage.getItem('fluffi_staked_'+currentAccount) * 1) + amt;
  stakedAt = now();
  window.localStorage.setItem('fluffi_staked_'+currentAccount, staked);
  window.localStorage.setItem('fluffi_stakeat_'+currentAccount, stakedAt);
  updateStakingUI();
  alert('Staked successfully! Rewards accumulate until presale ends.');
  document.getElementById('staking-form').reset();
}
document.getElementById('claim-staking').onclick = function() {
  if (now() < PRESALE_END) return alert('Claim at presale end!');
  if (!currentAccount) return alert('Connect your wallet!');
  let amt = window.localStorage.getItem('fluffi_staked_'+currentAccount)*1;
  let stAt = window.localStorage.getItem('fluffi_stakeat_'+currentAccount)*1;
  if (!(amt > 0 && stAt > 0)) return alert('You did not stake yet!');
  updateStakingUI();
  alert(`Claimed! Your FLUFFI staking rewards will be distributed after presale ends. Join Telegram for updates.`);
}

// ---------- UI Polishing: Fallback for Web3 ----------
(function(){
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/web3@1.10.3/dist/web3.min.js';
  s.onload = function() { window.Web3 = window.Web3; };
  document.body.appendChild(s);
})();

// ------------- Socials: Telegram/Twitter -------------
// Already present in header; add copy-links if needed

// ------------- SOL support placeholder ---------------
// Show alert for SOL wallet connect
// (Optionally you can attach event handlers for SOL support UI elements here)

// ----------------- END OF SCRIPT -------------------
