pragma solidity ^0.4.10;
/*
      No more panic sells.
      Force yourself to hodl them eths with HodlBox!
*/

contract HodlBox {

  uint public hodlTillBlock;
  address public hodler;
  uint public hodling;
  bool public withdrawn;

  event HodlReleased(bool _isReleased, uint _onBlock);

  function HodlBox(uint _blocks) payable {
    if (msg.value <= 0) throw;
    hodler = msg.sender;
    hodling += msg.value;
    hodlTillBlock = block.number + _blocks;
    withdrawn = false;
  }

  function releaseTheHodl() returns (bool) {
    // Only the contract creator can release funds from their HodlBox,
    // and only after the defined number of blocks has passed.
    if (msg.sender != hodler) throw;
    if (block.number < hodlTillBlock) throw;
    if (withdrawn) throw;
    if (hodling <= 0) throw;
    HodlReleased(true, block.number);

    var withdrawAmount = hodling;

    if (withdrawAmount > 0) {
      // It is important to set this to zero because the recipient
      // can call this function again as part of the receiving call
      // before `send` returns. See comment at bottom.
      hodling = 0;
      withdrawn = true;
      if (!hodler.send(withdrawAmount)) {
        hodling = withdrawAmount;
        withdrawn = false;
        return false;
      }
      HodlReleased(true, block.number);
    }
    return true;
  }

  // constant functions do not mutate state
  function hodlCountdown() constant returns (uint) {
    var hodlCount = hodlTillBlock - block.number;
    if (block.number >= hodlTillBlock) {
      return 0;
    }
    return hodlCount;
  }

  function isDeholdable() constant returns (bool) {
    if (block.number < hodlTillBlock) {
      return false;
    } else {
      return true;
    }
  }

}

// From Solidity Docs:
//
// It is a good guideline to structure functions that interact
// with other contracts (i.e. they call functions or send Ether)
// into three phases:
// 1. checking conditions
// 2. performing actions (potentially changing conditions)
// 3. interacting with other contracts
// If these phases are mixed up, the other contract could call
// back into the current contract and modify the state or cause
// effects (ether payout) to be performed multiple times.
// If functions called internally include interaction with external
// contracts, they also have to be considered interaction with
// external contracts.