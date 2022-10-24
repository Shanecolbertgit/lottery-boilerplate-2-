const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('..?compile');
const { isTypedArray } = require('util/types');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Comtracts(json.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: account[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
    isTypedArray('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows multibal accounts to enter', async () => {
        await lottery.methods.enter().send({
            form: accounts[0],
            value: web3.utils.toWei('0.02', 'either')
        });
        await lottery.methods.enter().send({
            form: accounts[1],
            value: web3.utils.toWei('0.02', 'either')
        });
        await lottery.methods.enter().send({
            form: accounts[2],
            value: web3.utils.toWei('0.02', 'either')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.lenght);
    });

    it('requires a minimum amount of either to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 200
            });
            assert(false);
        } catch (err) {
            assert(err);

        }
    });

    it('only manager can pick winner', async () => {
        try {
            await lottery.methods.pickWinners().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send
            ({ from: accounts[0] });

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        console.log(finalBalance - intialBalance);
        assert(difference > web3.utils.towei('1.8', 'ether'));
    });
});
