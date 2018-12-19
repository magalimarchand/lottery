//in command line: lottery$ npm run test

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const{interface,bytecode} = require('../compile');

let lottery; //contract
let accounts;


beforeEach(async () => {

	accounts = await web3.eth.getAccounts();

	lottery = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({data:bytecode})
		.send({from:accounts[0], gas:'1000000'});
});

describe('Lottery Contract', () => {

	it('deploys a contract', () =>{

		assert.ok(lottery.options.address);
	});

	it('allows one account to enter', async () => {

		await lottery.methods.enter().send({
			from:accounts[0],
			value:web3.utils.toWei('0.02', 'ether')
		});

		const players = await lottery.methods.getPlayers().call({
				from:accounts[0] //who is calling this function
			});

		assert.equal(accounts[0], players[0]);
		assert.equal(1, players.length);
	});

	it('allows multiple accounts to enter', async () => {

		await lottery.methods.enter().send({
			from:accounts[0],
			value:web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from:accounts[1],
			value:web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from:accounts[2],
			value:web3.utils.toWei('0.02', 'ether')
		});

		const players = await lottery.methods.getPlayers().call({
				from:accounts[0] //who is calling this function
			});

		assert.equal(accounts[0], players[0]);
		assert.equal(accounts[1], players[1]);
		assert.equal(accounts[2], players[2]);
		assert.equal(3, players.length);
	});

	//double verification: try/catch et assert(false)
	it('requires a minimum amount of ether to enter', async () => {

		try{
			await lottery.methods.enter().send({
				from: accounts[0],
				value:0
			});

			assert(false);

		} catch(err){

			assert(err);
		}
	});

	it('only manager can call pickWinner', async () => {

		try{
			await lottery.methods.pickWinner().send({
				from: accounts[1]
			});

			assert(false);

		}catch(err){

			assert(err);
		}
	});

	it('sends money to the winner and resets the players array', async () =>{

		//un seul joueur, pour etre sur de le recuperer comme gagnant
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('2', 'ether')
		});

		//balance de son compte apres le paiement de 2 ether pour entrer dans le jeu
		const initialBalance = await web3.eth.getBalance(accounts[0]);

		//choix du gagnant: le seul joueur
		await lottery.methods.pickWinner().send({
			from:accounts[0]
		});

		//balance du joueur apres qu'il ait gagne les 2 ether
		const finalBalance = await web3.eth.getBalance(accounts[0]);

		//Il y a une difference car la transaction necessite un paiement de gas
		const difference = finalBalance - initialBalance;

		//Juste pour verifier le prix de gas, pas utile ici pour le test, on
		//l'estime a .1 ether maximum
		console.log(finalBalance - initialBalance);

		assert(difference > web3.utils.toWei('1.9', 'ether'));

	});
});

