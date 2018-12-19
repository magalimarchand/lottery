pragma solidity ^0.4.17;

contract Lottery {
    
    address public manager;
    address[] public players;

    constructor() public payable{
        
        manager = msg.sender;
    }
    
    //used to aplly on multiple functions where it's needed
    modifier restricted(){
        
        //verify the sender is the manager
        require(msg.sender == manager);
        _;
    }
    
    function enter() public payable{
        
        //verify that sender(player) pay minimum of money
        require(msg.value > 0.01 ether);
        
        //add the player in the players array (lottery)
        players.push(msg.sender);
    }
    
    function random() private view returns(uint){
        
        //get a random number
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }
    
    function pickWinner() public restricted{
        
        //get an integer out of the random number
        uint index = random() % players.length;
        
        //give to winner total money of the contract (this)
        players[index].transfer(address(this).balance);
        
        //reset the contract: dynamic array:[] with initial size of 0:(0)
        players = new address[](0);
    }
    
    function getPlayers() public view returns(address[]){
        
        return players;
    }

}