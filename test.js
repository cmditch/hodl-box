Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
balances = () => {
  for (i = 0; i < web3.eth.accounts.length; i++) {
      weiBal = web3.eth.getBalance(web3.eth.accounts[i]).toNumber()
      console.log(web3.fromWei(weiBal))
  }
}
balances()



hodl = HodlBox.deployed()
hodl.then(a => a.hodling.call())
hodl.then(a => a.hodlCountdown.call())
hodl.then(a => a.releaseTheHodl.sendTransaction())


Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abi = [{"constant":true,"inputs":[],"name":"hodlTillBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"releaseTheHodl","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hodler","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hodlCountdown","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hodling","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"isDeholdable","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"withdrawn","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_blocks","type":"uint256"}],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_isReleased","type":"bool"},{"indexed":false,"name":"_onBlock","type":"uint256"}],"name":"HodlReleased","type":"event"}]

HodlBox = web3.eth.contract(abi)
hodlBox = HodlBox.at('0x5bab72b63bf38fa9e155dba7e5bdeebddb94c1e1')

released = hodlBox.HodlReleased()
released.watch((e, msg) => console.log(msg + "\n\n" + e))

balances = () => {
  for (i = 0; i < web3.eth.accounts.length; i++) {
      weiBal = web3.eth.getBalance(web3.eth.accounts[i]).toNumber()
      console.log(web3.fromWei(weiBal))
  }
}
balances()



web3.eth.getBalance(web3.eth.coinbase)
web3.eth.sendTransaction({from: web3.eth.coinbase, to: '0xbbdfd2b92584985bbdf84137a9ee68cee1fcc291', amount: 1000000000000000000 })
web3.eth.accounts.forEach( a => console.log(web3.eth.getBalance(a).toNumber()))
