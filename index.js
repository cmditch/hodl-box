
//  HodlBox
//  More Hodl, Less Panics
//
// Layout of index.js
// App Functions, App Store, Utility Functions, Contract Object, App Initializer
//

//  Application functions
window.App = {
  startApp: function() {
    web3Check();
    // Set Coinbase address
    AppState.coinbaseAddress = web3.toChecksumAddress(web3.eth.coinbase);
    // Define Contract factory
    AppState.hodlBoxContract = web3.eth.contract(HodlBox.abi);
    // update UI coinbase balance
    this.updateCoinbaseBalance();
  },

  updateCoinbaseBalance: function() {
    web3.eth.getBalance(AppState.coinbaseAddress, (e,r) => {
      logError(e);
      balance = web3.fromWei(r.toNumber(), 'ether')
      AppState.coinbaseBalance = parseFloat(balance).toFixed(2);
      $("#coinbase-balance").text(AppState.coinbaseBalance);
    });
  },

  formValid: function() {
    amount = AppState.ethAmount
    blocks = AppState.blockCount
    if ((amount > 0.0) && (blocks > 0)) {
      return true;
    } else {
      displayError("Zeros and blank fields are invalid!");
      return false;
    }
  },

  submitForm: function() {
    AppState.ethAmount = parseFloat($('#ethAmount').val());
    AppState.blockCount = parseInt($('#blockCount').val());
    web3Check();
    if (this.formValid()) {
      this.disableForm();
      this.deployContract();
    }
  },

  disableForm: function() {
    $('#contractButton').html("").addClass("loading");
    $('#ethAmount').attr("disabled", "disabled");
    $('#blockCount').attr("disabled", "disabled");
  },

  deployContract: function() {
    blocks = AppState.blockCount;
    value = AppState.ethAmount;
    self = this;
    AppState.hodlBoxContract.new(
       blocks, // First and only argument to contract constructor
       {
         from: AppState.coinbaseAddress,
         data: HodlBox.bytecode,
         gas: '2700000',
         value: web3.toWei(value, "ether")
       },
      (e, contract) => {
        logError(e);
        if (typeof contract.address !== 'undefined') {
           console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
           AppState.hodlBoxDeployed = contract;
           self.changeHodlForm();
           self.updateCoinbaseBalance();
           self.updateHodlBoxBalance();
           self.blockCountdown()
        }
     });
  },

  updateHodlBoxBalance: function() {
    AppState.hodlBoxDeployed.hodling.call( (e,r) => {
      logError(e);
      AppState.hodlBoxBalance = web3.fromWei(r.toNumber(), "ether");
      hodling = AppState.hodlBoxBalance;
      if ( hodling != undefined) { $("#hodlBoxHeld").text(hodling) };
    });
  },

  changeHodlForm: function() {
    $("#hodlForm").html("");
    $("#hodlForm").addClass("hodlHard");
  },

  hodlCountdown: function() {
    AppState.hodlBoxDeployed.hodlCountdown.call( (e,r) => {
      logError(e);
      AppState.blocksRemaining = r.toNumber();
      blocksRemaining = AppState.blocksRemaining;
      if(blocksRemaining === 0) {
        $("#hodlBoxCountdown").html(AppState.releaseHodlButton);
        clearInterval(AppState.countdown);
      } else if(blocksRemaining != undefined) {
        $("#hodlBoxCountdown").html("<div><div class='blockCount'>" + blocksRemaining + "</div>blocks of hodling left...</div>" )
      }
    });
  },

  blockCountdown: function() {
    this.hodlCountdown();
    AppState.countdown = setInterval( () => { this.hodlCountdown() }, 3000);
  },

  releaseTheHodl: function() {
    self = this;
    AppState.hodlBoxDeployed.releaseTheHodl.sendTransaction(
      { from: AppState.coinbaseAddress },
      (e,r) => {
        logError(e);
        console.log("Dehodled complete at tx: " + r);
        $("#releaseHodlText").text("");
        $("#releaseHodlButton").text("Waiting for DeHodl...");
        $("#releaseHodlButton").removeClass("button-primary").addClass("disabled-button");
        $("#releaseHodlButton").attr("disabled", "disabled");
        self.watchHodlReleaseEvent();
      }
    )
  },

  watchHodlReleaseEvent: function() {
    self = this;
    releaseEvent = AppState.hodlBoxDeployed.HodlReleased({_isReleased: true});
    releaseEvent.watch( (e,r) => {
      console.log("DeHodled!")
      $("#releaseHodlButton").text("DeHodl Complete!!");
      $("#hodlForm").removeClass("hodlHard").addClass("happyHodor");
      self.updateCoinbaseBalance();
      self.updateHodlBoxBalance();
      releaseEvent.stopWatching();
    })
  }
}


// Application Store
window.AppState = {
  hodlBoxContract: {},
  hodlBoxDeployed: {},
  hodlBoxAddress: '',
  hodlBoxBalance: 0,
  coinbaseAddress: '',
  coinbaseBalance: 0,
  ethAmount: 0,
  blockCount: 0,
  blocksRemaining: 0,
  countdown: null,
  releaseHodlButton: '<button id="releaseHodlButton" class="button button-primary" onClick="App.releaseTheHodl()">Release The Hodl!</button>'
}


// Utility Functions
displayError = e => {
  $("#error").text(e);
  setTimeout( () => $("#error").text(""), 5000 );
}

logError = e => { if (e != undefined || null) { console.log(e) } }

web3Check = () => { try {console.log(web3.eth.coinbase + " coinbase found")} catch (e) {displayError("RPC not found, Allow scripts using shield icon in address bar.")} }


// Contract Object
HodlBox = {
  abi: [{"constant":true,"inputs":[],"name":"hodlTillBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"releaseTheHodl","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hodler","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hodlCountdown","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hodling","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"isDeholdable","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"withdrawn","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_blocks","type":"uint256"}],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_isReleased","type":"bool"}],"name":"HodlReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_isCreated","type":"bool"}],"name":"Hodling","type":"event"}],

  bytecode: '0x60606040526040516020806104a0833981016040528080519060200190919050505b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550346002819055508043016000819055506000600360006101000a81548160ff0219169083151502179055507f50dad350d80b860c92a2c50f96a06c903fae56a2d3e8486560bdd175a09495176001604051808215151515815260200191505060405180910390a15b505b6103c5806100db6000396000f3006060604052361561008c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630c8b29ae1461008e5780632b1e5016146100b45780633bc58532146100c657806377a1ec4b146101185780637844ce811461013e578063bc7e8d3c14610164578063c80ec5221461018e578063d0e30db0146101b8575bfe5b341561009657fe5b61009e6101c2565b6040518082815260200191505060405180910390f35b34156100bc57fe5b6100c46101c8565b005b34156100ce57fe5b6100d66102fe565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561012057fe5b610128610324565b6040518082815260200191505060405180910390f35b341561014657fe5b61014e61034b565b6040518082815260200191505060405180910390f35b341561016c57fe5b610174610351565b604051808215151515815260200191505060405180910390f35b341561019657fe5b61019e610373565b604051808215151515815260200191505060405180910390f35b6101c0610386565b005b60005481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102255760006000fd5b6000544310156102355760006000fd5b600360009054906101000a900460ff16156102505760006000fd5b60006002541115156102625760006000fd5b6001600360006101000a81548160ff02191690831515021790555060006002819055507fb19183f24dc3d962470aed6aef737565168c37e29c6c3b024504225bff9d8a5f6001604051808215151515815260200191505060405180910390a1600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600043600054039050600054431015156103435760009150610347565b8091505b5090565b60025481565b60006000544310156103665760009050610370565b60019050610370565b5b90565b600360009054906101000a900460ff1681565b346002600082825401925050819055505b5600a165627a7a723058200389e9edaf45a52de5595a180bd33c220d46dcd81c6e98615758b1b082549bdf0029'
}


// Application Initializer
window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
    console.log("Hodl connected to web3...")
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  setTimeout( () => App.startApp(), 300 );
});
