var BN = require('bn.js');
const fs = require('fs');

var TracToken = artifacts.require('TracToken'); // eslint-disable-line no-undef

var Hub = artifacts.require('Hub'); // eslint-disable-line no-undef
var Profile = artifacts.require('Profile'); // eslint-disable-line no-undef

var ProfileStorage = artifacts.require('ProfileStorage'); // eslint-disable-line no-undef
var TestingUtilities = artifacts.require('TestingUtilities'); // eslint-disable-line no-undef

var Voting = artifacts.require('Voting'); // eslint-disable-line no-undef

const amountToMint = (new BN(5)).mul((new BN(10)).pow(new BN(30)));

module.exports = async (deployer, network, accounts) => {
    let hub;
    let token;

    let profile;

    let profileStorage;
    let voting;

    var amounts = [];
    var recepients = [];

    var nodeIds = [];
    var identities = [];
    var oldIdentities = [];
    var indexes = [];

    var offers = [];
    var offerFinisher;

    var temp;
    var i;

    var filepath = '';
    var file;
    var data;

    switch (network) {
    case 'ganache':
        await deployer.deploy(Hub, { gas: 6000000, from: accounts[0] })
            .then((result) => {
                hub = result;
            });

        profileStorage = await deployer.deploy(
            ProfileStorage,
            hub.address, { gas: 6000000, from: accounts[0] },
        );
        await hub.setProfileStorageAddress(profileStorage.address);

        token = await deployer.deploy(TracToken, accounts[0], accounts[1], accounts[2]);
        await hub.setTokenAddress(token.address);

        profile = await deployer.deploy(Profile, hub.address, { gas: 9000000, from: accounts[0] });
        await hub.setProfileAddress(profile.address);

        for (let i = 0; i < 10; i += 1) {
            amounts.push(amountToMint);
            recepients.push(accounts[i]);
        }
        await token.mintMany(recepients, amounts, { from: accounts[0] });
        await token.finishMinting({ from: accounts[0] });

        console.log('\n\n \t Contract adressess on ganache:');
        console.log(`\t Hub contract address: \t\t\t${hub.address}`);
        console.log(`\t Token contract address: \t\t${token.address}`);
        console.log(`\t Profile contract address: \t\t${profile.address}`);

        console.log(`\t ProfileStorage contract address: \t${profileStorage.address}`);
        break;
    case 'votingTest':
        await deployer.deploy(TestingUtilities);

        await deployer.deploy(Hub, { gas: 6000000, from: accounts[0] })
            .then((result) => {
                hub = result;
            });

        profileStorage = await deployer.deploy(
            ProfileStorage,
            hub.address, { gas: 6000000, from: accounts[0] },
        );
        await hub.setProfileStorageAddress(profileStorage.address);

        token = await deployer.deploy(TracToken, accounts[0], accounts[1], accounts[2]);
        await hub.setTokenAddress(token.address);

        profile = await deployer.deploy(Profile, hub.address, { gas: 9000000, from: accounts[0] });
        await hub.setProfileAddress(profile.address);

        for (let i = 0; i < accounts.length; i += 1) {
            amounts.push(amountToMint);
            recepients.push(accounts[i]);
        }
        await token.mintMany(recepients, amounts, { from: accounts[0] });
        await token.finishMinting({ from: accounts[0] });

        voting = await deployer.deploy(Voting, token.address, profileStorage.address);

        break;
    case 'rinkeby':
        await deployer.deploy(Hub, { gas: 6000000, from: accounts[0] })
            .then((result) => {
                hub = result;
            });

        await hub.setTokenAddress('0x98d9a611ad1b5761bdc1daac42c48e4d54cf5882');

        profileStorage = await deployer.deploy(
            ProfileStorage,
            hub.address,
            { gas: 6000000, from: accounts[0] },
        );
        await hub.setProfileStorageAddress(profileStorage.address);

        profile = await deployer.deploy(Profile, hub.address, { gas: 7000000, from: accounts[0] });
        await hub.setProfileAddress(profile.address);

        console.log('\n\n \t Contract adressess on rinkeby:');
        console.log(`\t Hub contract address: \t\t\t${hub.address}`);
        console.log(`\t Profile contract address: \t\t${profile.address}`);

        console.log(`\t ProfileStorage contract address: \t${profileStorage.address}`);
        break;
    case 'live':     
        hub = await Hub.at('0xa287d7134fb40bef071c932286bd2cd01efccf30');

        token = await hub.tokenAddress.call();
        profileStorage = await hub.profileStorageAddress.call();

        voting = await deployer.deploy(
            Voting,
            token,
            profileStorage,
            { gas: 6000000, gasPrice: 8000000000 },
        );
        break;
    default:
        console.warn('Please use one of the following network identifiers: ganache, mock, test, or rinkeby');
        break;
    }
};
