let addressInput = document.getElementById("addressInput");
let messageInput = document.getElementById("messageInput");
let coinSelect = document.getElementById("coinSelect");
let serviceSelect = document.getElementById("serviceSelect");
let identifierInput = document.getElementById("identifierInput");
let userAddress = document.getElementById("userAddress");
let userBalance = document.getElementById("userBalance");
let userName = document.getElementById("userName");
let amountInput = document.getElementById("amountInput");
let donationAddress = "";
let activeAddress = "";
let activeName = "";
let activeFile = document.getElementById("fileInput").files[0];


initialize();

// Initialize the Q-App
async function initialize() {

  //Add event listeners for the buttons
  document.getElementById("messageButton").addEventListener("click", () => sendMessage());
  document.getElementById("coinButton").addEventListener("click", () => sendCoins());
  document.getElementById("bothButton").addEventListener("click", () => sendBoth());
  document.getElementById("devFundButton").addEventListener("click", () => donateToDevFund());
  document.getElementById("publishButton").addEventListener("click", () => publish());
  coinSelect.addEventListener("change", () => checkBalance());

  try {
    // Get the account of the logged-in user
    let account = await qortalRequest({
        action: "GET_USER_ACCOUNT"
    });
    activeAddress = account.address;
    // Display the user's address
    userAddress.innerHTML = "Your Qortal Address: " + activeAddress;
    checkName(activeAddress);
    //errorArea.innerHTML = "<p>ADDRESS FOUND!<br/>Response Object: " + account + "<br/>Response String: " + JSON.stringify(account) + "</p>";
  } catch (error) {
    userAddress.innerHTML = "Your Address: " + JSON.stringify(error);
    userName.innerHTML = "Your Name: " + JSON.stringify(error);
  }
  checkBalance();
}

function clearAddress() {
  addressInput.value = "";
}

function clearMessage() {
  messageInput.value = "";
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

// Check account Name
async function checkName(address) {
  try {
    let nameInfo = await qortalRequest({
      action: "GET_ACCOUNT_NAMES",
      address: address
    });
    // Display the user's name if they have one
    if (nameInfo.length > 0) {
      activeName = nameInfo[0].name;
      userName.innerHTML = "Your Registered Name: " + activeName;
    } else {
      userName.innerHTML = "No Registered Name";
    }
  } catch (error) {
    userName.innerHTML = "Your Name: " + JSON.stringify(error);
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

// Publish content to QDN
async function publish() {
  if (activeName != "") {
    try {
      let res = await qortalRequest({
        action: "PUBLISH_QDN_RESOURCE",
        name: activeName,
        service: serviceSelect.value,
        identifier: identifierInput.value,
        file: activeFile
      })
      messageInput.value = "Your content is available at:<br/><br/>qortal://" + res.service + "/" + res.name + "/" + res.identifier;
    } catch (error) {
      messageInput.value = JSON.stringify(error);
    }
  } else {
    messageInput.value = "A Registered Name is required to publish to QDN."
  }
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
  if (coinSelect.value === "RVN") {
    try {
      let res = await qortalRequest({
        action: "SEND_COIN",
        coin: coinSelect.value,
        destinationAddress: donationAddress,
        amount: amountInput.value,
        fee: 0.00001000 // 0.00001000 fee per byte
      });
      //errorArea.innerHTML = "<p>DONATION SENT!<br/>Response Object: " + res + "<br/>Response String: " + JSON.stringify(res) + "</p>";
    } catch (error) {
      messageInput.value = JSON.stringify(error);
    }
  } else {
    try {
      let res = await qortalRequest({
        action: "SEND_COIN",
        coin: coinSelect.value,
        destinationAddress: donationAddress,
        amount: amountInput.value
        //fee: 20 // 0.00000020 fee per byte
      });
      //errorArea.innerHTML = "<p>DONATION SENT!<br/>Response Object: " + res + "<br/>Response String: " + JSON.stringify(res) + "</p>";
    } catch (error) {
      messageInput.value = JSON.stringify(error);
    }
  }
}
