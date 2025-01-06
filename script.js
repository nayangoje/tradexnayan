// Initialize token money and update balance
let tokenMoney = 1000000;
let accountBalance = document.getElementById("account-balance");
accountBalance.textContent = `$${tokenMoney.toLocaleString()}`;

// Set up API endpoint for CoinGecko (using their free API for live prices)
const API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd";

// Function to fetch live prices from CoinGecko API
async function fetchLivePrices() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Extracting data for Bitcoin (BTC), Ethereum (ETH), and Litecoin (LTC)
        const btcPrice = data.bitcoin.usd;
        const ethPrice = data.ethereum.usd;
        const ltcPrice = data.litecoin.usd;

        // Update the prices on the webpage
        document.getElementById("btc-price").textContent = btcPrice.toLocaleString();
        document.getElementById("eth-price").textContent = ethPrice.toLocaleString();
        document.getElementById("ltc-price").textContent = ltcPrice.toLocaleString();
    } catch (error) {
        console.error("Error fetching live prices:", error);
        alert("Error fetching live prices. Please try again later.");
    }
}

// Call the function to fetch prices when the page loads
window.onload = fetchLivePrices;

// Handle trade modal
let tradeModal = document.getElementById("tradeModal");
let tradeButtons = document.querySelectorAll(".trade");
let confirmTradeBtn = document.getElementById("confirmTradeBtn");
let cancelTradeBtn = document.getElementById("cancelTradeBtn");
let cryptoAmountInput = document.getElementById("crypto-amount");

// Display modal
tradeButtons.forEach(button => {
    button.addEventListener("click", () => {
        tradeModal.style.display = "flex";
    });
});

// Close modal
cancelTradeBtn.addEventListener("click", () => {
    tradeModal.style.display = "none";
});

// Confirm trade and update balance
confirmTradeBtn.addEventListener("click", () => {
    let amount = parseFloat(cryptoAmountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
    } else {
        let cryptoType = document.querySelector('button[data-crypto]:focus')?.dataset.crypto;

        // Assuming the user is buying the cryptocurrency based on the selected row
        let price;
        if (cryptoType === "BTC") {
            price = parseFloat(document.getElementById("btc-price").textContent.replace(",", ""));
        } else if (cryptoType === "ETH") {
            price = parseFloat(document.getElementById("eth-price").textContent.replace(",", ""));
        } else if (cryptoType === "LTC") {
            price = parseFloat(document.getElementById("ltc-price").textContent.replace(",", ""));
        }

        // Calculate the total cost of the purchase
        let totalCost = amount * price;

        // Check if the user has enough token money
        if (totalCost <= tokenMoney) {
            tokenMoney -= totalCost;
            accountBalance.textContent = `$${tokenMoney.toLocaleString()}`;
            alert(`You bought ${amount} ${cryptoType} for $${totalCost.toLocaleString()}.`);
            tradeModal.style.display = "none";
        } else {
            alert("Insufficient funds.");
        }
    }
});

// Close modal if clicked outside
window.addEventListener("click", (event) => {
    if (event.target === tradeModal) {
        tradeModal.style.display = "none";
    }
});
