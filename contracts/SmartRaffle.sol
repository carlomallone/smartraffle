pragma solidity ^0.4.18;

import "installed_contracts/oraclize/contracts/usingOraclize.sol";

library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract SmartRaffle is usingOraclize{
  using SafeMath for uint;

  address owner;
  uint public minimumBet = 10000000000000000; // 0.01 ETH
  uint public maximumBet = 1000000000000000000; // 1 ETH
  uint public jackpot;
  uint public jackpotLimit;
  uint public constant LIMIT_JACKPOT = 10000000000000000000; // 10 ETH
  uint public numberWinner = 0;
  uint public houseCutDivisor = 100;
  uint public houseCut;
  uint public houseShare;
  uint public winnerShare;
  bool public isPaused = false;
  uint public totalTickets = 0;
  mapping(address => uint) playerBetValue;
  mapping(address => uint) playerTickets;

  struct TicketRecord {
    uint minTicket;
    uint maxTicket;
    address player;
  }

  TicketRecord[] records;

  event Bet(
    address indexed _from,
    uint _value,
    uint _ticketsAmount
  );

  event Win(
    address indexed _winner,
    uint _value,
    uint _number
  );

  function SmartRaffle(uint _minimumBet, uint _maximumBet, uint _jackpotLimit) {
    owner = msg.sender;
    jackpotLimit = LIMIT_JACKPOT;

    if(_minimumBet > 0) minimumBet = _minimumBet;
    if(_maximumBet > 0) maximumBet = _maximumBet;
    if(_jackpotLimit > 0) jackpotLimit = _jackpotLimit;

    jackpot = 0;
    houseShare = 0;
    winnerShare = 0;

    ownerSetHouseCut(4);
    oraclize_setProof(proofType_Ledger);
  }

  modifier onEndGame(){
    if(jackpot >= jackpotLimit) _;
  }

  modifier onlyOwner(){
    require(msg.sender == owner);
    _;
  }

  modifier onPause() {
    require(isPaused);
    _;
  }

  /**
  * @dev Safenet to avoid lost funds for erroneus transactions
  */
  function() payable {}

  /**
  * @dev Calculates tickets amount for a bet, with bonuses.
  * @dev Grants 100%/200%/300% bonus tickets to early punters
  * @dev when jackpot is less than 75%/50%/25% limit
  * @param _bet Bet amount in wei
  */
  function ticketsNumberForBet(uint _bet) constant returns(uint){
    uint baseTickets = (_bet.div(10000000000000000));

    if(jackpot >= (jackpotLimit.mul(3)).div(4)) {
      return baseTickets;
    } else if(jackpot >= jackpotLimit.div(2)) {
      return baseTickets * 2;
    } else if(jackpot >= jackpotLimit.div(4)) {
      return baseTickets * 3;
    } else {
      return baseTickets * 4;
    }
    return baseTickets;
  }

  /**
  * @dev Checks if player is already enrolled in raffle.
  * @param _player The player address.
  */
  function checkPlayerExists(address _player) private returns(bool) {
    if(playerBetValue[_player] > 0)
      return true;
    else
      return false;
  }

  /**
  * @dev Accepts bets.
  */
  function placeBet() payable {
    // Check that jackpot limit has not been exceeded
    require(jackpot < jackpotLimit);

    // Check that bet is valid
    require(msg.value >= minimumBet);
    require(msg.value <= maximumBet);

    // Check that player is not already enrolled
    require(checkPlayerExists(msg.sender) == false);

    // Add the right amounts of tickets for the player
    // One entry for each 0.01 ETH
    uint ticketsAmount = ticketsNumberForBet(msg.value);
    uint endingTicketNumber = totalTickets+ticketsAmount-1;

    records.push(TicketRecord({
      minTicket: totalTickets,
      maxTicket: endingTicketNumber,
      player: msg.sender
    }));

    // Save bet for this player in case we need to refund
    playerBetValue[msg.sender] = msg.value;
    playerTickets[msg.sender] = ticketsAmount;

    // Update jackpot and tickets count
    jackpot = jackpot.add(msg.value);
    totalTickets = totalTickets.add(ticketsAmount);

    Bet(msg.sender, msg.value, ticketsAmount);

    // End raffle if target jackpot hit
    if(jackpot >= jackpotLimit) generateNumberWinner();
  }

  /**
  * @dev Resets local variables for the next raffle round.
  */
  function cleanupVars() private {
    jackpot = 0;
    houseShare = 0;
    winnerShare = 0;
    totalTickets = 0;
    numberWinner = 0;

    for(uint i=0; i<records.length; i++) {
      playerBetValue[records[i].player] = 0;
      playerTickets[records[i].player] = 0;
    }

    delete records;
  }

  /**
  * @dev Refunds given address of its bet amount.
  * @param _address The address to send the refund to.
  */
  function refundAddress(address _address) private {
    require(checkPlayerExists(_address) == true);
    _address.transfer(playerBetValue[_address]);
  }

  /**
  * @dev Refunds all players enrolled in the raffle.
  * @dev Perform a final cleanup when done.
  */

  function refundPlayers() private {
    for(uint i = 0; i < records.length; i++){
      refundAddress(records[i].player);
    }

    cleanupVars();
  }

  /**
  * @dev Asks Oraclize for random number.
  */
  function generateNumberWinner() payable onEndGame {
    uint N = 7;
    uint delay = 0;
    uint callbackGas = 1200000;

    bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas);
  }

  /**
  * @dev Oraclize callback. Refunds players is something go wrong.
  * @dev Uses random number to choose raffle winning ticket.
  */
  function __callback(
    bytes32 _queryId,
    string _result,
    bytes _proof
  ) oraclize_randomDS_proofVerify(_queryId, _result, _proof) onEndGame {
    require(msg.sender == oraclize_cbAddress());

    if(bytes(_result).length == 0 || bytes(_proof).length == 0) {
      refundPlayers();
    } else {
      numberWinner = (uint(sha3(_result)) % totalTickets);
      sendPrize();
    }
  }

  /**
  * @dev Used by 'sendPrize'. Recursively looks for winner in TicketRecord array
  * @dev In order to save gas it does not cycle but use binary tree logic
  * @dev to find winner in base 2 O(logN) steps.
  * @param _number The winning ticket number
  * @param _startIndex The elements array left-most element index
  * @param _length The length of elements subset
  */
  function findWinner(uint _number, uint _startIndex, uint _length) private returns (address) {
    uint index = (_length % 2 > 0) ? _length.div(2) : (_length.div(2)).sub(1);
    index = index.add(_startIndex);
    TicketRecord entry = records[index];

    if(_number >= entry.minTicket && _number <= entry.maxTicket){
      return entry.player;
    } else {
      if(_number < entry.minTicket) {
        return findWinner(_number, _startIndex, _length.div(2));
      } else {
        return findWinner(_number, index.add(1), _length.div(2));
      }
    }
  }

  /**
  * @dev Calculates and sends both house cut and winner prize.
  * @dev Performs a final cleanup when done.
  */
  function sendPrize() private onEndGame {
    houseShare = houseCut.mul(jackpot.div(houseCutDivisor));
    winnerShare = jackpot.sub(houseShare);

    address winner = findWinner(numberWinner, 0, records.length);
    winner.transfer(winnerShare);
    Win(winner, winnerShare, numberWinner);

    cleanupVars();

    // Transfer remaining ETH to owner
    owner.transfer(this.balance);
  }

  /**
  * @dev Stop raffle and refunds all players (emergency use only).
  */
  function abortGame() public onlyOwner {
    refundPlayers();
  }

  /**
  * @dev Lets player read his active bet.
  */
  function getPlayerBet() public returns(uint) {
    if(playerBetValue[msg.sender] > 0)
      return playerBetValue[msg.sender];
    else
      return 0;
  }

  /**
  * @dev Lets player read his active tickets number.
  */
  function getPlayerTickets() public returns(uint) {
    return playerTickets[msg.sender];
  }

  /**
  * @dev Returns total tickets sold amount.
  */
  function getTickets() returns (uint) {
    return totalTickets;
  }

  /**
  * @dev Returns owner address.
  */
  function getOwner() returns (address) {
    return owner;
  }

  /**
  * @dev Pauses/resumes game (emergency/maintenance use only)
  * @param _newIsPaused The new true/false value for game pause
  */
  function setPause(bool _newIsPaused) public onlyOwner {
    isPaused = _newIsPaused;
  }

  /**
  * @dev Updates the house cut.
  * @param _newHouseCut The new % value for house cut.
  */
  function ownerSetHouseCut(uint _newHouseCut) public onlyOwner {
    houseCut = _newHouseCut;
  }
}
