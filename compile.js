// node module for crossplatform compatibility: windows, linux
const path = require('path');  
//file system module
const fs = require('fs');  
//solidity compiler solc
const solc = require('solc');


//relative path of the Inbox.sol file
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

//read the file
const source = fs.readFileSync(lotteryPath, 'utf8');


//compile
module.exports = solc.compile(source, 1).contracts[':Lottery'];




