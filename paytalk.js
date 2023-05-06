let addressInput = document.getElementById("addressInput");
let messageInput = document.getElementById("messageInput");
let coinSelect = document.getElementById("coinSelect");
let userAddress = document.getElementById("userAddress");
let userBalance = document.getElementById("userBalance");
let amountInput = document.getElementById("amountInput");
let donationAddress = "";

initialize();

// Initialize the Q-App
async function initialize() {

  //Add event listeners for the buttons
  document.getElementById("messageButton").addEventListener("click", () => sendMessage());
  document.getElementById("coinButton").addEventListener("click", () => sendCoins());
  document.getElementById("bothButton").addEventListener("click", () => sendBoth());
  document.getElementById("devFundButton").addEventListener("click", () => donateToDevFund());
  //coinSelect.addEventListener("change", () => checkBalance());

  try {
    // Get the account of the logged-in user
    let account = await qortalRequest({
        action: "GET_USER_ACCOUNT"
    });
    // Display the user's address
    userAddress.innerHTML = "Your Qortal Address: " + account.address;
    //errorArea.innerHTML = "<p>ADDRESS FOUND!<br/>Response Object: " + account + "<br/>Response String: " + JSON.stringify(account) + "</p>";
  } catch (error) {
    userAddress.innerHTML = "Your Address: " + JSON.stringify(error);
  }
  checkBalance();
}

// Check wallet balance
async function checkBalance() {
  try {
    let balance = await qortalRequest({
      action: "GET_WALLET_BALANCE",
      coin: coinSelect.value
    });
    // Display the user's balance
    userBalance.innerHTML = "Your " + coinSelect.value + " Balance: " + JSON.stringify(balance);
    //errorArea.innerHTML = "<p>BALANCE FOUND!<br/>Response Object: " + balance + "<br/>Response String: " + JSON.stringify(balance) + "</p>";
  } catch (error) {
    userBalance.innerHTML = "Your Balance: " + JSON.stringify(error);
  }
}

// Send a message
async function sendMessage() {
  if (addressInput.value == "") {
    addressInput.value = "Enter an Address"
    return;
  }
  if (messageInput.value == "") {
    messageInput.value = "Enter a Message"
    return;
  }
  try {
    let res = await qortalRequest({
      action: "SEND_CHAT_MESSAGE",
      destinationAddress: addressInput.value,
      message: messageInput.value
    });
    //errorArea.innerHTML = "<p>MESSAGE SENT!<br/>Response Object: " + res + "<br/>Response String: " + JSON.stringify(res) + "</p>";
  } catch (error) {
    messageInput.value = JSON.stringify(error);
  }
}

// Send coins
async function sendCoins() {
  if (amountInput.value <= 0) {
    messageInput.value = "Enter an Amount"
    return;
  }
  if (addressInput.value == "") {
    addressInput.value = "Enter an Address"
    return;
  }
  try {
    let res = await qortalRequest({
      action: "SEND_COIN",
      coin: coinSelect.value,
      destinationAddress: addressInput.value,
      amount: amountInput.value
      //fee: 0.00000020 // fee per byte
    });
    //errorArea.innerHTML = "<p>COINS SENT!<br/>Response Object: " + res + "<br/>Response String: " + JSON.stringify(res) + "</p>";
  } catch (error) {
    messageInput.value = JSON.stringify(error);
  }
}

// Send both a message & coins
async function sendBoth() {
  sendMessage();
  sendCoins();
}

// Donate to the DevFund
async function donateToDevFund() {
  if (amountInput.value <= 0) {
    messageInput.value = "Enter an Amount"
    return;
  }
  switch (coinSelect.value) {
    case "QORT":
      donationAddress = "QWfYVQfuz2rVskYkpkVvLxL3kUPmBgKhHV";
      break;
    case "BTC":
      donationAddress = "19Uxk958Tb1oZFiSXs49eLBEsQbzx5EEDD";
      break;
    case "LTC":
      donationAddress = "LgBtdjD8nAmSFNFN17o97q3xMjHvZce6ct";
      break;
    case "DOGE":
      donationAddress = "D9YFWugMrCWyVxWriL6gyQYDydMqG9E7qk";
      break;
    case "RVN":
      donationAddress = "REzoxtdywQbcXbLpKeWcHB6XrCPByTJyEL";
      break;
    case "DGB":
      donationAddress = "DTd6im3ryhJketrwXAn7cpUqKNGX2nQvsW";
      break;
    case "ARRR":
      donationAddress = "zs17flf0wuj6yslpd0y9h6pet3ttdwz6zztrdy3akh6lht02xvyjnnrf53qc74tn8h6065jghhvdx2";
      break;
  }
  try {
    let res = await qortalRequest({
      action: "SEND_COIN",
      coin: coinSelect.value,
      destinationAddress: donationAddress,
      amount: amountInput.value
      //fee: 0.00000020 // fee per byte
    });
    //errorArea.innerHTML = "<p>DONATION SENT!<br/>Response Object: " + res + "<br/>Response String: " + JSON.stringify(res) + "</p>";
  } catch (error) {
    messageInput.value = JSON.stringify(error);
  }
}
