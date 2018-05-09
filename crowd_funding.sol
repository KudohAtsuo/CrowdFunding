pragma solidity ^0.4.21;


/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    if (a == 0) {
      return 0;
    }
    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}


pragma solidity ^0.4.21;

//crowdfunding contract
//infinit fundraising version. This contract accepts funds even if goal amount has reached.
contract CrowdFunding{
  using SafeMath for uint;
  // investor info
  struct Investor{
    address addr;
    uint amount;
  }

  // owner: owner address of this contracgt.
  // openingTime: When the crowdfunding starts.
  // closingTime: When the crowdfunding ends.
  // status: checking status if the crowdfunding is open or close.
  // goalAmount: goal amount of this funding.
  // totalAmount: accumlated amount so far.
  // isReached: True if total amount reached the goal.
  // numInvesters: number of investers.
  address public ownerOfContract;
  string public status;
  uint public closingTime;
  bool public ended;
  uint public goalAmount;
  uint public totalAmount;
  bool public isReached;
  uint public numInvestors;
  // To map the investers' number to stract.
  mapping(uint => Investor) public investors;

  // only owner modifier.
  modifier onlyOwner(){
    require(msg.sender == ownerOfContract);
    _;
  }

  // constructor
  function CroudFunding(uint _duration, uint _goalAmount) public {
    ownerOfContract = msg.sender;
    status = "Funding";
    closingTime = now.add(_duration);
    ended = false;
    goalAmount = _goalAmount;
    totalAmount = 0;
    isReached = false;
    numInvestors = 0;
  }

  // function for investing
  function invest() public payable{
    require(!(msg.value <= 0));
    require(!ended);

    investors[numInvestors].addr = msg.sender;
    investors[numInvestors].amount = msg.value;

    numInvestors = numInvestors.add(1);
    totalAmount = totalAmount.add(msg.value);

    if(totalAmount >= goalAmount){
      isReached = true;
    }
  }

  // To check if totalamount has reached the goal after closingTime.
  function checkGoal() onlyOwner public{
    require(!ended);
    require(now >= closingTime);

    if(isReached){
      status = "Suceeded! Thank you!";
      ended = true;

      ownerOfContract.transfer(address(this).balance);
    } else {
      status = "Funding Failed";
      ended = true;

      for(uint i = 0; i < numInvestors; i++){
      
        
        investors[numInvestors].addr.transfer(investors[numInvestors].amount);
      }
    }

  }
}



