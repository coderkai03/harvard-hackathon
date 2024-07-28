// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoinFlipToken is ERC20 {
    mapping(address => uint256) public lastFlipTime;
    uint256 public constant FLIP_COOLDOWN = 1 hours;
    uint256 public constant FLIP_REWARD = 10 * 10**18; // 10 tokens

    constructor(uint256 initialSupply) ERC20("CoinFlipToken", "CFT") {
        _mint(msg.sender, initialSupply);
    }

    function flipCoin() public returns (bool) {
        require(block.timestamp >= lastFlipTime[msg.sender] + FLIP_COOLDOWN, "Wait for cooldown");
        lastFlipTime[msg.sender] = block.timestamp;

        bool isHeads = (block.timestamp % 2 == 0);
        if (isHeads) {
            _mint(msg.sender, FLIP_REWARD);
        }

        emit CoinFlipped(msg.sender, isHeads);
        return isHeads;
    }

    event CoinFlipped(address player, bool isHeads);
}
