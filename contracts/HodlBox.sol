pragma solidity ^0.4.11;
/*
      No more panic sells.
      Force yourself to hodl them eths with HodlBox!
*/

contract HodlBox {

  struct Hodler {
    uint amount;
    uint releaseOnBlock;
  }

  mapping (address => Hodler) public hodlers;

  event HodlReleased(address indexed hodler, uint amount);

  function deposit(uint hodlForBlocks) payable {
    Hodler h = hodlers[msg.sender];
    if (h.amount > 0) throw;
    h.amount = msg.value;
    h.releaseOnBlock = (block.number + hodlForBlocks);
  }

  function releaseTheHodl() {
    Hodler h = hodlers[msg.sender];
    if (h.amount <= 0) throw;
    if (block.number < h.releaseOnBlock) throw;
    var hodlAmount = h.amount;
    hodlers[msg.sender].amount = 0; // Update balance before sending ETH to avoid DAO type exploit.
    msg.sender.transfer(hodlAmount);
    HodlReleased(msg.sender, h.amount);
  }

  function hodlCountdown() constant returns (uint) {
    Hodler h = hodlers[msg.sender];
    var hodlCount = h.releaseOnBlock - block.number;
    if (hodlCount <= 0) {
      return 0;
    }
    return hodlCount;
  }
}
