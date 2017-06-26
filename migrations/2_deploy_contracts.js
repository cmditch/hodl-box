var HodlBox = artifacts.require("./HodlBox.sol");

module.exports = function(deployer) {
  deployer.deploy(HodlBox, 100, {from: web3.eth.accounts[0], value: (9.32 * 10 ** 18)});
};
