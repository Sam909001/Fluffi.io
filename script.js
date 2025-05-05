const contractAddress = "0x60A94bc12d0d4F782Fd597e5E1222247CFb7E297";

const abi = [
  {
    "inputs":[{"internalType":"address","name":"referrer","type":"address"}],
    "name":"contribute",
    "outputs":[],
    "stateMutability":"payable",
    "type":"function"
  }
];

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install MetaMask!");
    return null;
  }

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await ethereum.request({ method: 'eth_chainId' });

    if (chainId !== "0x38" && chainId !== "0x61") {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x61" }], // BSC Testnet (0x61), use "0x38" for BSC mainnet
      });
    }

    return accounts[0];
  } catch (err) {
    console.error("Wallet connect error:", err);
    return null;
  }
}

async function buyTokens() {
  const amountBNB = document.getElementById("bnbAmount").value;
  const referrer = document.getElementById("referral").value || "0x0000000000000000000000000000000000000000";

  if (!amountBNB || isNaN(amountBNB)) {
    alert("Enter a valid BNB amount.");
    return;
  }

  const userAddress = await connectWallet();
  if (!userAddress) return;

  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);
  const amountInWei = web3.utils.toWei(amountBNB.toString(), "ether");

  try {
    const tx = await contract.methods.contribute(referrer).send({
      from: userAddress,
      value: amountInWei,
    });

    console.log("Transaction success:", tx);
    alert("Success! You bought FLUFFI tokens.");
  } catch (error) {
    console.error("Transaction failed:", error);
    alert("Transaction failed: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const buyBtn = document.getElementById("buyButton");
  if (buyBtn) {
    buyBtn.addEventListener("click", buyTokens);
  }
});
