contract Lottery {
    address public owner;
    address payable[] public players;

    constructor() {
        owner = msg.sender;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function join() public payable {
        require(msg.value >= 1 ether);
        players.push(payable(msg.sender));
    }

    function randomNumber() public view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            ) % players.length;
    }

    function getWinner() public {
        uint256 winnerIndex = randomNumber();
        address payable winner = players[winnerIndex];
        winner.transfer(address(this).balance);
        players = new address payable[](0);
    }
}
