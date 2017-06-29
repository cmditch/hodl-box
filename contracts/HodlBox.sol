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

  event HodlReleased(bool _isReleased);
  event Hodling(bool _isCreated);

  function HodlBox(uint _blocks) payable {
    hodler = msg.sender;
    hodling = msg.value;
    hodlTillBlock = block.number + _blocks;
    withdrawn = false;
    Hodling(true);
  }

  function deposit() payable {
    hodling += msg.value;
  }

  function releaseTheHodl() {
    // Only the contract creator can release funds from their HodlBox,
    // and only after the defined number of blocks has passed.
    if (msg.sender != hodler) throw;
    if (block.number < hodlTillBlock) throw;
    if (withdrawn) throw;
    if (hodling <= 0) throw;
    withdrawn = true;
    hodling = 0;

    // Send event to notifiy UI
    HodlReleased(true);

    // Convenient way to transfer contract funds
    // Saves on gas too, both on contract creation and function execution.
    // A clear incentive to "clean up after yourself" on the blockchain.
    selfdestruct(hodler);
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
