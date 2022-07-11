//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Pay__WinnerFailed();
error Function__NotCalled();
error Lottery__UpKeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 state
);

/** @title A contract for a lottery
 *  @author Maximilian Mathews
 *  @notice This contract is for creating a decentralized, untamperable lottery
 *  @dev This impliments Chainlink VRF v2 and Chainlink keepers
 */
contract Lottery is VRFConsumerBaseV2, KeeperCompatibleInterface {
    enum LotteryState {
        OPEN,
        CLOSED
    }
    LotteryState private CurrentState;

    // Creates list of lottery contestants
    address[] public entries;
    address public immutable Owner;
    address public Winner = 0x0000000000000000000000000000000000000000;

    //local variables
    VRFCoordinatorV2Interface private immutable vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callBackGasLimit;
    uint16 private constant REQUEST_CONFORMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    uint256 private lastTimeStamp;
    uint256 private immutable i_interval;

    //events
    event EnteredLottery(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed Winner);

    constructor(
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callBackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        Owner = msg.sender;
        vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callBackGasLimit = callBackGasLimit;
        CurrentState = LotteryState.OPEN;
        lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    fallback() external payable {}

    receive() external payable {}

    // Enters a new contestant into the lottery via entries array. Checks if the lottery is open
    // and if the new contestant has already been entered.
    function EnterLottery() public payable {
        require(CurrentState == LotteryState.OPEN, "Lottery is closed.");
        require(msg.value == 1e17, "Wrong amount of ETH.");
        address[] memory m_entries = entries;
        bool Repeated;
        for (uint256 i = 0; i < m_entries.length; i++) {
            address addr = m_entries[i];
            // check if address is unique
            require(
                msg.sender != addr,
                "This address has already been entered."
            );
            Repeated = false;
            // if the address is not already list
        }
        require(Repeated == false); //redudant
        entries.push(payable(msg.sender));
        emit EnteredLottery(msg.sender);
    }

<<<<<<< HEAD
    function getNumEntries() public view returns (uint256) {
=======
    function ViewContestants() public view returns (address[] memory) {
>>>>>>> b4287f2ab452b1079d8fc4778f2e77809bb9e68a
        return entries.length;
    }

    function viewContestant(uint256 place) public view returns (address) {
        return entries[place];
    }

    function getWinner() public view returns (address) {
        return Winner;
    }

    function getLotteryState() public view returns (LotteryState) {
        return CurrentState;
    }

    function getLatestTimeStamp() public view returns (uint256) {
        return lastTimeStamp;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function checkUpkeep(bytes memory)
        public
        override
        returns (bool needsUpkeep, bytes memory)
    {
        bool isOpen = (LotteryState.OPEN == CurrentState);
        bool timePassed = ((block.timestamp - lastTimeStamp) > i_interval);
        bool hasPlayers = (entries.length > 0);
        bool hasBalance = (address(this).balance > 0);
        needsUpkeep = (isOpen && timePassed && hasPlayers && hasBalance);
    }

    function performUpkeep(bytes calldata) external override {
        (bool needsUpkeep, ) = checkUpkeep("");
        if (!needsUpkeep) {
            revert Lottery__UpKeepNotNeeded(
                address(this).balance,
                entries.length,
                uint256(CurrentState)
            );
        }
        CurrentState = LotteryState.CLOSED;
        uint256 requestId = vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFORMATIONS,
            i_callBackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256, /*requestID*/
        uint256[] memory randomWords
    ) internal override {
        uint256 Rand = randomWords[0] % entries.length;
        Winner = entries[Rand];
        CurrentState = LotteryState.OPEN;
        delete entries;
        lastTimeStamp = block.timestamp;
        (bool success, ) = Winner.call{value: address(this).balance}("");
        if (!success) {
            revert Pay__WinnerFailed();
        }
        emit WinnerPicked(Winner);
    }
}
