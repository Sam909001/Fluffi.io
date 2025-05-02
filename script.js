<script>
// Connect to BNB Testnet
const web3 = new Web3(window.ethereum);

const presaleContractAddress = "0xE47565637b477dc1De60dfcCB98015806fd22176";

// ABI (simplified for buyTokens function only)
const presaleABI = [
  {
    "inputs": [],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const presaleContract = new web3.eth.Contract(presaleABI, presaleContractAddress);

async function connectWallet() {
  if (window.ethereum) {
    try {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      const bnbTestnetId = "0x61"; // BNB Testnet Chain ID (97)
      if (chainId !== bnbTestnetId) {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: bnbTestnetId }],
        });
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  } else {
    alert("Please install MetaMask to use this feature.");
  }
}

async function buyWithBNB() {
  const account = await connectWallet();
  if (!account) return;

  const amount = document.getElementById("bnbAmount").value;
  if (!amount || isNaN(amount)) {
    alert("Please enter a valid BNB amount.");
    return;
  }

  const amountInWei = web3.utils.toWei(amount, 'ether');
  try {
    await presaleContract.methods.buyTokens().send({
      from: account,
      value: amountInWei
    });
    alert("Purchase successful! Tokens will be claimable after listing.");
  } catch (err) {
    console.error("Transaction failed:", err);
    alert("Transaction failed: " + err.message);
  }
}
</script>
