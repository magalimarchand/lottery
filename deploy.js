//online testing provider
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
//interface is the ABI between the network and the javascript code
//bytecode is the compiled contract
const {interface,bytecode} = require('./compile');

//mnemonic MetaMask phrase + Rinkeby (by Infura) network connection (real online node)
const provider = new HDWalletProvider(
	'wrist remove faculty sausage intact keen spell veteran fly void height cannon',
	'https://rinkeby.infura.io/v3/c557ac02ece74d1cafcf9807de64e80c');

//instance of web3, and connection to the online test server Rinkeby/Infura provider
const web3 = new Web3(provider);

//function instead of variable to make it asynchronous
const deploy = async ()=>{

	try{
		const accounts = await web3.eth.getAccounts();

		console.log("Attempting to deploy from account: ", accounts[0]);

		const result = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data:'0x' + bytecode })  // data:'0x' + bytecode 
		.send({ gas:'1000000', from:accounts[0]});

		console.log(interface);
		console.log("Contract deployed to: ", result.options.address);
		}
	catch(e){
		console.log("error catch");
	}
}; 

deploy(); /*** $ node deploy.js ***/