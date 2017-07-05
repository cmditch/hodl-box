pragma solidity ^0.4.11;
/*
      No more panic sells.
      Force yourself to hodl them eths with HodlBox!
*/

contract HodlBox {

  /*struct Hodler {
    uint amount;
    uint releaseOnBlock;
  }*/

  mapping (address => uint) public hodlAmount;
  mapping (address => uint) public hodlTillBlock;

  event HodlReleased(address indexed hodler, uint amount);

  function deposit(uint hodlForBlocks) payable {
    if (hodlAmount[msg.sender] > 0) throw;
    hodlAmount[msg.sender] = msg.value;
    hodlTillBlock[msg.sender] = (block.number + hodlForBlocks);
  }

  function releaseTheHodl() {
    if (hodlAmount[msg.sender] <= 0) throw;
    if (hodlTillBlock[msg.sender] > block.number) throw;
    var dehodling = hodlAmount[msg.sender];
    hodlAmount[msg.sender] = 0; // Update balance before sending ETH to avoid DAO type exploit.
    msg.sender.transfer(dehodling);
    HodlReleased(msg.sender, dehodling);
  }

  function hodlCountdown() constant returns (uint) {
    var hodlCount = hodlTillBlock[msg.sender] - block.number;
    if (hodlCount <= 0) {
      return 0;
    }
    return hodlCount;
  }
}
