const result = require('dotenv').config({ path: `${__dirname}/.env` });
var HDWalletProvider = require('truffle-hdwallet-provider'); // eslint-disable-line import/no-unresolved

var rinkebyMnemonic = process.env.TRUFFLE_MNEMONIC;
var liveMnemonic = process.env.LIVE_MNEMONIC;

module.exports = {
    compilers: {
        solc: {
            version: '0.4.25',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
            },
        },
    },

    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            gas: 4000000,
            network_id: '*', // Match any network id
        },

        ganache: {
            host: 'localhost',
            port: 7545,
            gas: 6000000,
            network_id: '5777',
        },
 
        votingTest: {
            host: 'localhost',
            port: 7545,
            gas: 6000000,
            network_id: '5777',
        },

        rinkeby: {
            host: 'localhost', // Connect to geth on the specified
            port: 8545,
            provider: () => new HDWalletProvider(rinkebyMnemonic, `https://rinkeby.infura.io/${process.env.RINKEBY_ACCESS_KEY}`),
            network_id: 4,
            gas: 6000000, // Gas limit used for deploys
            websockets: true,
            skipDryRun: true,
        },

        live: {
            host: 'localhost',
            port: 8545,
            provider: () => new HDWalletProvider(liveMnemonic, `https://mainnet.infura.io/${process.env.MAINNET_ACCESS_KEY}`),
            network_id: 1,
            gas: 6000000, // Gas limit used for deploys
            websockets: true,
            skipDryRun: true,
        },
    },
};
