pragma solidity ^0.8.11;

contract BettingContract {
    address public userA;
    address public userB;
    uint256 public betAmount;
    bool public betPlaced;
    bool public betAccepted;

    // Modifier to restrict function access to userA or userB
    modifier onlyParticipants() {
        require(msg.sender == userA || msg.sender == userB, "Not a participant");
        _;
    }

    // Function for userA to place a bet
    function placeBet() external payable {
        require(!betPlaced, "Bet already placed");
        require(msg.value > 0, "Bet amount must be greater than 0");

        userA = msg.sender;
        betAmount = msg.value;
        betPlaced = true;
    }

    // Function for userB to accept the bet by depositing the same amount
    function acceptBet() external payable {
        require(betPlaced, "No bet placed yet");
        require(!betAccepted, "Bet already accepted");
        require(msg.value == betAmount, "Deposit must match the bet amount");

        userB = msg.sender;
        betAccepted = true;
    }

    // Function for either userA or userB to withdraw the total funds
    function withdraw() external onlyParticipants {
        require(betPlaced && betAccepted, "Bet not completed yet");

        uint256 totalAmount = address(this).balance;
        payable(msg.sender).transfer(totalAmount);

        // Reset contract state
        resetBet();
    }

    // Internal function to reset the contract state for reuse
    function resetBet() internal {
        userA = address(0);
        userB = address(0);
        betAmount = 0;
        betPlaced = false;
        betAccepted = false;
    }

    // Function to check the balance of the contract
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}