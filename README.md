# Lottery-Project

This is my first Dapp project. It contains a fully functional backend with one smart contract. The front end works but dosent utillize all the functions of the smart contract. I have chosen not to make the front end fully functional to move on to a more complex project and continue my learning. Also the exlcuded functions were for the owner of the contract and thus dont require a front end.

### Main Smart Contract Functions:
  1. EnterLottery: 
     This function's purpose is to enter a user's address into the list of contestants (entries array).
     It takes a value of 1e15 wei (0.001 eth) to enter the lottery.
     And doesnt let user in if the lottery is closed, the user doesnt have enough ETH, or the user's address is already in the list of contestants.
     
 2. RunLottery: 
     This function allows the owner of the contract to select the winner of the lottery. It doesnt take any params. It doesnt allow the function to be called if the     `      user has a non-owner addresses or if the lottery is closed.
     
 3. PayWinners:
    This function pays the winner of the lottery the entire balance of the contract. It doesnt take any params. It doesnt allow the function to be called if the     `      user has a non-owner addresses or if the winner has not been selected. The function also resets the lottery so that new users can enter (removes old users) and a new winner can be selected.
