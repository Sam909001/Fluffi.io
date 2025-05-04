<script>
// Connect to BNB Testnet
const web3 = new Web3(window.ethereum);

const presaleContractAddress = "0xfcc8e15857AeFee92FE761Bfe5a7300C7D44AdB5";

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
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x60A94bc12d0d4F782Fd597e5E1222247CFb7E297";
const ABI = [ /* Paste the full ABI here (you already have it) */ ];

async function buyFluffi(amountBNB, referrerAddress = ethers.constants.AddressZero) {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask to proceed.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Convert BNB amount to wei
    const amountInWei = ethers.utils.parseEther(amountBNB.toString());

    const tx = await contract.contribute(referrerAddress, {
      value: amountInWei,
    });

    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    alert("Success! You bought FLUFFI tokens.");
  } catch (err) {
    console.error("Buy failed:", err);
    alert("Transaction failed. See console for details.");
  }
}
function handleBuy() {
  const bnb = document.getElementById("bnbAmount").value;
  const ref = document.getElementById("referral").value || ethers.constants.AddressZero;
  buyFluffi(bnb, ref);
}
document.getElementById('buyButton').addEventListener('click', buyTokens);
async function buyTokens() {
    if (!window.ethereum || !window.ethereum.selectedAddress) {
        alert("Please connect your wallet first.");
        return;
    }

    const web3 = new Web3(window.ethereum);
    const contractAddress = "0x60A94bc12d0d4F782Fd597e5E1222247CFb7E297";
    const abi = [/* your ABI here */]; // Replace with full ABI
    const contract = new web3.eth.Contract(abi, contractAddress);

    const referrer = "0x0000000000000000000000000000000000000000"; // Replace with valid referrer
    const amountInBNB = 0.01; // or get from input
    const amountInWei = web3.utils.toWei(amountInBNB.toString(), "ether");

    try {
        const receipt = await contract.methods
            .contribute(referrer)
            .send({
                from: window.ethereum.selectedAddress,
                value: amountInWei,
            });

        console.log("Transaction successful:", receipt);
        alert("Purchase successful!");
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed: " + error.message);
    }
}
