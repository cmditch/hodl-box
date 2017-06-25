var HodlBox = artifacts.require("./HodlBox.sol");

module.exports = function(deployer) {
  deployer.deploy(HodlBox, 5, {from: web3.eth.accounts[0], value: (10 * 10 ** 18)});
};
