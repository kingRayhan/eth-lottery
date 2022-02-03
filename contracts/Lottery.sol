pragma solidity ^0.8.0;

contract Lottery {
    address public owner;
    address payable[] private players;

    constructor() {
        owner = msg.sender;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function join() public payable NeedMinimum(1 ether) {
        players.push(payable(msg.sender));
    }

    function randomNumber() public view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            );
    }

    function getWinner() public onlyOwner {
        uint256 winnerIndex = randomNumber();
        address payable winner = players[winnerIndex];
        winner.transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier NeedMinimum(uint256 minimum) {
        require(msg.value >= minimum);
        _;
    }
}
