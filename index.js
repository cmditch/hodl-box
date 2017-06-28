var hodlBoxContract;
var hodlBoxDeployed;
var blocks;
var hodlBoxAbi;

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
  setTimeout( () => startApp(), 500 );
});


startApp = () => {
  // Identify the network
  web3.version.getNetwork((err, netId) => {
    switch (netId) {
      case "1":
        console.log('This is mainnet')
        break
      case "2":
        console.log('This is the deprecated Morden test network.')
        break
      case "3":
        console.log('This is the ropsten test network.')
        break
      default:
        console.log('This is an unknown network.')
    }
  });

  // Now you can start your app & access web3 freely:
  console.log("Hodl started...")

  var myCoinbase = web3.toChecksumAddress(web3.eth.coinbase)
  $(".coinbase").text(myCoinbase);

  hodlBoxAbi = [{"constant":true,"inputs":[],"name":"hodlTillBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"releaseTheHodl","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hodler","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hodlCountdown","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hodling","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"isDeholdable","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"withdrawn","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_blocks","type":"uint256"}],"payable":true,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_isReleased","type":"bool"}],"name":"HodlReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_isCreated","type":"bool"}],"name":"Hodling","type":"event"}]

  hodlBoxContract = web3.eth.contract(hodlBoxAbi);

  deployHodlBox = () => {
    amount = $("#amount").val();
    hodlBoxDeployed = hodlBoxContract.new(
       10,
       {
         from: web3.eth.coinbase,
         amount: amount,
         data: '0x606060405260405160208061035183398101604052515b600034116100245760006000fd5b60018054600160a060020a03191633600160a060020a0316178155346002554382016000556003805460ff1916905560408051918252517f50dad350d80b860c92a2c50f96a06c903fae56a2d3e8486560bdd175a0949517916020908290030190a15b505b6102b9806100986000396000f300606060405236156100675763ffffffff60e060020a6000350416630c8b29ae811461009c5780632b1e5016146100be5780633bc58532146100d057806377a1ec4b146100fc5780637844ce811461011e578063bc7e8d3c14610140578063c80ec52214610164575b61009a5b604051600160a060020a033316903480156108fc02916000818181858888f19350505050151561009757fe5b5b565b005b34156100a457fe5b6100ac610188565b60408051918252519081900360200190f35b34156100c657fe5b61009a61018e565b005b34156100d857fe5b6100e0610233565b60408051600160a060020a039092168252519081900360200190f35b341561010457fe5b6100ac610242565b60408051918252519081900360200190f35b341561012657fe5b6100ac610262565b60408051918252519081900360200190f35b341561014857fe5b610150610268565b604080519115158252519081900360200190f35b341561016c57fe5b610150610284565b604080519115158252519081900360200190f35b60005481565b60015433600160a060020a039081169116146101aa5760006000fd5b6000544310156101ba5760006000fd5b60035460ff16156101cb5760006000fd5b600254600090116101dc5760006000fd5b6003805460ff19166001908117909155600060025560408051918252517fb19183f24dc3d962470aed6aef737565168c37e29c6c3b024504225bff9d8a5f9181900360200190a1600154600160a060020a0316ff5b565b600154600160a060020a031681565b600080544380820391901061025a576000915061025e565b8091505b5090565b60025481565b600060005443101561027c57506000610280565b5060015b5b90565b60035460ff16815600a165627a7a72305820d1029f5a1a2e9d69b7f84aa7e444ffd8985c946135e85f1399545888f85ae7c90029',
         gas: '700000'
       }, function (e, contract){
        console.log(e, contract);
        if (typeof contract.address !== 'undefined') {
             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
        }
     })
  }; // deployHodlBox

} //startApp
