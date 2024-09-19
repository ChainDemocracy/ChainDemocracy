ragma solidity ^0.8.11;

contract BettingContract { 

    enum GameStatus {
        PendingAccept,
        PendingWithdraw,
        Finished,
        Rejected
    }

    struct Game {
        address userA;
        address userB;
        uint256 betAmount;
        GameStatus status;
        uint256 createdAt;
    }

    mapping(uint256 => Game) public games;
    mapping(address => uint256[]) public userPendingGames;
    mapping(address => uint256[]) public userPendingWithdrawals;
    mapping(address => uint256[]) public userFinishedGames;
    uint256 public gameIdCounter;
    
    // Events
    event GameCreated(uint256 gameId, address userA, address userB, uint256 betAmount, uint256 createdAt);
    event GameAccepted(uint256 gameId, address userA, address userB);
    event GameFinished(uint256 gameId, address userA, address userB);
    event GameRejected(uint256 gameId, address userA, address userB);

    modifier onlyParticipants(uint256 gameId) {
        require(
            msg.sender == games[gameId].userA || msg.sender == games[gameId].userB,
            "Not a participant"
        );
        _;
    }

    function createGame(address invitee) external payable returns (uint256) {
        require(msg.value > 0, "Bet amount must be greater than 0");

        gameIdCounter++;
        uint256 newGameId = gameIdCounter;

        games[newGameId] = Game({
            userA: msg.sender,
            userB: invitee,
            betAmount: msg.value,
            status: GameStatus.PendingAccept,
            createdAt: block.timestamp
        });

        userPendingGames[msg.sender].push(newGameId);
        userPendingGames[invitee].push(newGameId);

        emit GameCreated(newGameId, msg.sender, invitee, msg.value, block.timestamp);

        return newGameId;
    }

    function acceptInvite(uint256 gameId) external payable {
        Game storage game = games[gameId];

        require(game.status == GameStatus.PendingAccept, "Game is not accepting bets");
        require(msg.sender == game.userB, "Only the invited user can accept");
        require(msg.value == game.betAmount, "Deposit must match the bet amount");

        // GAME LOGIC GONNA BE HERE

        game.status = GameStatus.PendingWithdraw;

        // Remove game from pending games and update finished games
        removeFromPendingGames(game.userA, gameId);
        removeFromPendingGames(game.userB, gameId);
        userPendingWithdrawals[game.userA].push(gameId);
        userPendingWithdrawals[game.userB].push(gameId);

        emit GameAccepted(gameId, game.userA, game.userB);
    }

    function withdraw(uint256 gameId) external onlyParticipants(gameId) {
        Game storage game = games[gameId];

        require(game.status == GameStatus.Finished, "Game is not finished yet");

        uint256 totalAmount = address(this).balance;
        payable(msg.sender).transfer(totalAmount);

        game.status = GameStatus.Finished;

        removeFromPendingWithdrawals(game.userA, gameId);
        removeFromPendingWithdrawals(game.userB, gameId);
        userFinishedGames[game.userA].push(gameId);
        userFinishedGames[game.userB].push(gameId);

        emit GameFinished(gameId, game.userA, game.userB);
    }

    // UserA can reject game while userB not accepted, returning his bet
    function rejectGame(uint256 gameId) external {
        Game storage game = games[gameId];

        require(game.status == GameStatus.PendingAccept, "Game cannot be rejected at this stage");
        require(msg.sender == game.userA, "Only userA can reject the game");

        game.status = GameStatus.Rejected;

        payable(game.userA).transfer(game.betAmount);

        emit GameRejected(gameId, game.userA, game.userB);
    }

    function removeFromPendingGames(address user, uint256 gameId) internal {
        uint256[] storage pendingGames = userPendingGames[user];
        for (uint256 i = 0; i < pendingGames.length; i++) {
            if (pendingGames[i] == gameId) {
                pendingGames[i] = pendingGames[pendingGames.length - 1];
                pendingGames.pop();
                break;
            }
        }
    }

    function removeFromPendingWithdrawals(address user, uint256 gameId) internal {
        uint256[] storage pendingWithdrawals = userPendingWithdrawals[user];
        for (uint256 i = 0; i < pendingWithdrawals.length; i++) {
            if (pendingWithdrawals[i] == gameId) {
                pendingWithdrawals[i] = pendingWithdrawals[pendingWithdrawals.length - 1];
                pendingWithdrawals.pop();
                break;
            }
        }
    }

    // Get specific game details
    function getGameDetails(uint256 gameId) external view returns (
        address, address, uint256, GameStatus, uint256
    ) {
        Game storage game = games[gameId];
        return (game.userA, game.userB, game.betAmount, game.status, game.createdAt);
    }

    // Get users pending games
    function getUserPendingGames(address user) external view returns (uint256[] memory) {
        return userPendingGames[user];
    }

    // Get users withdrawals
    function getUserWithdrawals(address user) external view returns (uint256[] memory) {
        return userPendingWithdrawals[user];
    }

    // Get users finished games history
    function getUserFinishedGames(address user) external view returns (uint256[] memory) {
        return userFinishedGames[user];
    }

    // function getRandomNumber() public view returns (uint256) {
    //     // Generate a pseudo-random number based on block data and sender's address
    //     uint256 randomHash = uint256(
    //         keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))
    //     );
        
    //     // Map the random hash to a number between 2 and 12
    //     uint256 randomNumber = (randomHash % 11) + 2; // % 11 gives a number from 0-10, + 2 ensures 2-12
        
    //     return randomNumber;
    // }
}