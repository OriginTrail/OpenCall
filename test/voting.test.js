var BN = require('bn.js'); // eslint-disable-line no-undef
const { assert, expect } = require('chai');

var TestingUtilities = artifacts.require('TestingUtilities'); // eslint-disable-line no-undef
var TracToken = artifacts.require('TracToken'); // eslint-disable-line no-undef

var Hub = artifacts.require('Hub'); // eslint-disable-line no-undef

var Profile = artifacts.require('Profile'); // eslint-disable-line no-undef

var ProfileStorage = artifacts.require('ProfileStorage'); // eslint-disable-line no-undef

var Voting = artifacts.require('Voting'); // eslint-disable-line no-undef
var Identity = artifacts.require('Identity'); // eslint-disable-line no-undef

var Web3 = require('web3');

var web3;

var Ganache = require('ganache-core');

var hub;
var trac;
var profile;
var profileStorage;
var voting;
var util;

const tokensToDeposit = (new BN(100)).mul(new BN(10).pow(new BN(21)));
const identities = [];

// Special voter indexes
var emptyWalletEmptyProfile;
var emptyWalletFullProfile;
var fullWalletEmptyProfile;

// eslint-disable-next-line no-undef
contract('Voting tests', async (accounts) => {
    // eslint-disable-next-line no-undef
    before(async () => {
        // Get contracts used in hook
        hub = await Hub.deployed();
        trac = await TracToken.deployed();
        profile = await Profile.deployed();
        profileStorage = await ProfileStorage.deployed();
        voting = await Voting.deployed();

        util = await TestingUtilities.deployed();

        // Generate web3 and set provider
        web3 = new Web3('HTTP://127.0.0.1:7545');
        web3.setProvider(Ganache.provider());

        // Generate eth_account, identities, and profiles

        // Increase approval for depositing tokens
        var promises = [];
        for (var i = 0; i < accounts.length - 2; i += 1) {
            promises[i] = trac.increaseApproval(
                profile.address,
                tokensToDeposit,
                { from: accounts[i] },
            );
        }
        await Promise.all(promises);


        var res;
        // Generate profiles
        for (i = 0; i < accounts.length - 2; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            res = await profile.createProfile(
                accounts[i],
                '0x4cad6896887d99d70db8ce035d331ba2ade1a5e1161f38ff7fda76cf7c308cde',
                tokensToDeposit,
                false,
                '0x7e9f99b7971cb3de779690a82fec5e2ceec74dd0',
                { from: accounts[i] },
            );
            identities[i] = res.logs[0].args.newIdentity;
        }

        // Set up special conditions for wallets
        let balance = await trac.balanceOf.call(accounts[accounts.length - 1]);
        await trac.transfer(accounts[0], balance, { from: accounts[accounts.length - 1] });
        balance = await trac.balanceOf.call(accounts[accounts.length - 3]);
        await trac.transfer(accounts[0], balance, { from: accounts[accounts.length - 3] });

        res = await Identity.new(accounts[accounts.length - 1], accounts[accounts.length - 1]);
        identities[accounts.length - 1] = res.address;
        res = await Identity.new(accounts[accounts.length - 2], accounts[accounts.length - 2]);
        identities[accounts.length - 2] = res.address;

        emptyWalletEmptyProfile = accounts.length - 1;
        fullWalletEmptyProfile = accounts.length - 2;
        emptyWalletFullProfile = accounts.length - 3;
    });

    // eslint-disable-next-line no-undef
    it('Should check initial candidate state', async () => {
        const promises = [];
        for (let i = 33; i >= 0; i -= 1) {
            promises[i] = voting.candidates.call(i);
        }
        const candidates = await Promise.all(promises);

        assert.equal(candidates[0].name, 'Air Sourcing', 'Candidate name incorrect');
        assert.equal(candidates[1].name, 'Ametlab', 'Candidate name incorrect');
        assert.equal(candidates[2].name, 'B2B Section of Slovenian Blockchain Association (SBCA)', 'Candidate name incorrect');
        assert.equal(candidates[3].name, 'Beleaf & Co', 'Candidate name incorrect');
        assert.equal(candidates[4].name, 'BioGenom 2.0', 'Candidate name incorrect');
        assert.equal(candidates[5].name, 'CAM Engineering', 'Candidate name incorrect');
        assert.equal(candidates[6].name, 'Dispensa Dei Tipici', 'Candidate name incorrect');
        assert.equal(candidates[7].name, 'Fuzzy Factory', 'Candidate name incorrect');
        assert.equal(candidates[8].name, 'GSC Platform', 'Candidate name incorrect');
        assert.equal(candidates[9].name, 'HydraWarehouse', 'Candidate name incorrect');
        assert.equal(candidates[10].name, 'Ibis Eteh', 'Candidate name incorrect');
        assert.equal(candidates[11].name, 'Infotrans', 'Candidate name incorrect');
        assert.equal(candidates[12].name, 'Intelisale', 'Candidate name incorrect');
        assert.equal(candidates[13].name, 'Istmos', 'Candidate name incorrect');
        assert.equal(candidates[14].name, 'Ivy Food Tech', 'Candidate name incorrect');
        assert.equal(candidates[15].name, 'Journey Foods', 'Candidate name incorrect');
        assert.equal(candidates[16].name, 'Kakaxi', 'Candidate name incorrect');
        assert.equal(candidates[17].name, 'L.Co', 'Candidate name incorrect');
        assert.equal(candidates[18].name, 'LynqWallet', 'Candidate name incorrect');
        assert.equal(candidates[19].name, 'MedicoHealth AG', 'Candidate name incorrect');
        assert.equal(candidates[20].name, 'Moku Menehune', 'Candidate name incorrect');
        assert.equal(candidates[21].name, 'NetSDL', 'Candidate name incorrect');
        assert.equal(candidates[22].name, 'Orchit', 'Candidate name incorrect');
        assert.equal(candidates[23].name, 'Phy2Trace', 'Candidate name incorrect');
        assert.equal(candidates[24].name, 'Procurean', 'Candidate name incorrect');
        assert.equal(candidates[25].name, 'PsyChain', 'Candidate name incorrect');
        assert.equal(candidates[26].name, 'RealMeal', 'Candidate name incorrect');
        assert.equal(candidates[27].name, 'Reterms', 'Candidate name incorrect');
        assert.equal(candidates[28].name, 'Sensefinity', 'Candidate name incorrect');
        assert.equal(candidates[29].name, 'Solomon Ears', 'Candidate name incorrect');
        assert.equal(candidates[30].name, 'Space Invoices', 'Candidate name incorrect');
        assert.equal(candidates[31].name, 'Step Online', 'Candidate name incorrect');
        assert.equal(candidates[32].name, 'TMA', 'Candidate name incorrect');
        assert.equal(candidates[33].name, 'Zemlja&Morje', 'Candidate name incorrect');

        for (let i = candidates.length - 1; i >= 0; i -= 1) {
            assert(candidates[i].votes.isZero(), 'Candidate initial votes not set to zero');
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by giving approval from a non owner address', async () => {
        const voterWallets = [accounts[0]];
        const voterIdentities = [identities[0]];

        const expectedErrorMessage = 'Only contract owner can call this function';

        try {
            await voting.approveMultipleWallets(
                voterWallets,
                voterIdentities,
                { from: accounts[1] },
            );
            assert(false, 'Approval did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === false, `Wallet ${voterWallets[i]} has approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by giving approval to a wallet with profile and not enough tokens in both', async () => {
        const voterWallets = [accounts[emptyWalletEmptyProfile]];
        const voterIdentities = [identities[emptyWalletEmptyProfile]];

        const expectedErrorMessage = 'Neither wallet nor profile have at least 1000 trac at the time of approval';

        let balance = await trac.balanceOf(accounts[emptyWalletEmptyProfile]);
        assert(balance.isZero(), `Wallet balance not zero, but actually ${balance.toString()}`);
        balance = await profileStorage.getStake(identities[emptyWalletEmptyProfile]);
        assert(balance.isZero(), `Profile balance not zero, but actually ${balance.toString()}`);

        const res = await voting.approveMultipleWallets(voterWallets, voterIdentities);
        const approval = await voting.walletApproved.call(voterWallets[0]);
        assert(approval === false, 'Approval did not fail!');
        assert(
            JSON.stringify(res).includes(expectedErrorMessage),
            `Incorrect error thrown! Received: \n${JSON.stringify(res)}`,
        );

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === false, `Wallet ${voterWallets[i]} has approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by giving approval to a wallet without profile and not enough tokens', async () => {
        const voterWallets = [accounts[emptyWalletFullProfile]];
        const voterIdentities = ['0x0000000000000000000000000000000000000000'];

        const expectedErrorMessage = 'Wallet does not have at least 1000 trac at the time of approval';

        const res = await voting.approveMultipleWallets(voterWallets, voterIdentities);
        const approval = await voting.walletApproved.call(voterWallets[0]);
        assert(approval === false, 'Approval did not fail!');
        assert(
            JSON.stringify(res).includes(expectedErrorMessage),
            `Incorrect error thrown! Received: \n${JSON.stringify(res)}`,
        );

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === false, `Wallet ${voterWallets[i]} has approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by giving approval to a wallet which is not a management wallet', async () => {
        const voterWallets = [accounts[0]];
        const voterIdentities = [identities[1]];

        const expectedErrorMessage = 'Wallet is not a management wallet for the submitted ERC725Address';

        const res = await voting.approveMultipleWallets(voterWallets, voterIdentities);
        const approval = await voting.walletApproved.call(voterWallets[0]);
        assert(approval === false, 'Approval did not fail!');
        assert(
            JSON.stringify(res).includes(expectedErrorMessage),
            `Incorrect error thrown! Received: \n${JSON.stringify(res)}`,
        );
    });

    // eslint-disable-next-line no-undef
    it('Should fail by giving approval to an empty wallet', async () => {
        const voterWallets = ['0x0000000000000000000000000000000000000000'];
        const voterIdentities = [identities[0]];

        const expectedErrorMessage = 'Cannot verify an empty wallet';

        const res = await voting.approveMultipleWallets(voterWallets, voterIdentities);
        const approval = await voting.walletApproved.call(voterWallets[0]);
        assert(approval === false, 'Approval did not fail!');
        assert(
            JSON.stringify(res).includes(expectedErrorMessage),
            `Incorrect error thrown! Received: \n${JSON.stringify(res)}`,
        );

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === false, `Wallet ${voterWallets[i]} has approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should test giving approval to a wallet with profile and enough tokens in both', async () => {
        const voterWallets = [accounts[0]];
        const voterIdentities = [identities[0]];

        await voting.approveMultipleWallets(voterWallets, voterIdentities);

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === true, `Wallet ${voterWallets[i]} does not have approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should test giving approval to a wallet with profile and enough tokens in wallet', async () => {
        const voterWallets = [accounts[fullWalletEmptyProfile]];
        const voterIdentities = [identities[fullWalletEmptyProfile]];

        await voting.approveMultipleWallets(voterWallets, voterIdentities);

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === true, `Wallet ${voterWallets[i]} does not have approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should test giving approval to a wallet with profile and enough tokens in profile', async () => {
        const voterWallets = [accounts[emptyWalletFullProfile]];
        const voterIdentities = [identities[emptyWalletFullProfile]];

        await voting.approveMultipleWallets(voterWallets, voterIdentities);

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === true, `Wallet ${voterWallets[i]} does not have approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should test giving approval to a wallet without profile and enough tokens', async () => {
        const voterWallets = [accounts[1]];
        const voterIdentities = ['0x0000000000000000000000000000000000000000'];

        await voting.approveMultipleWallets(voterWallets, voterIdentities);

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === true, `Wallet ${voterWallets[i]} does not have approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should test giving approval to multiple wallets with profiles', async () => {
        const voterWallets = [accounts[2], accounts[3]];
        const voterIdentities = [identities[2], identities[3]];

        await voting.approveMultipleWallets(voterWallets, voterIdentities);

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === true, `Wallet ${voterWallets[i]} does not have approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should test giving approval to multiple wallets without profiles', async () => {
        const voterWallets = [accounts[4], accounts[5]];
        const voterIdentities = ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000'];

        await voting.approveMultipleWallets(voterWallets, voterIdentities);

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === true, `Wallet ${voterWallets[i]} does not have approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by removing approval from a non owner address', async () => {
        const voterWallets = [accounts[4]];

        const expectedErrorMessage = 'Only contract owner can call this function';

        try {
            await voting.disapproveMultipleWallets(
                voterWallets,
                { from: accounts[1] },
            );
            assert(false, 'Removing approval did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it('Should test removing approval', async () => {
        const voterWallets = [accounts[4]];

        await voting.disapproveMultipleWallets(voterWallets);

        const promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        const results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === false, `Wallet ${voterWallets[i]} has approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should test removing approval from multiple wallets', async () => {
        const voterWallets = [accounts[4], accounts[5]];
        const voterIdentities = ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000'];

        await voting.approveMultipleWallets(voterWallets, voterIdentities);

        let promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        let results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === true, `Wallet ${voterWallets[i]} does not have approval!`);
        }

        await voting.disapproveMultipleWallets(voterWallets);

        promises = [];
        for (let i = voterWallets.length - 1; i >= 0; i -= 1) {
            promises[i] = voting.walletApproved.call(voterWallets[i]);
        }
        results = await Promise.all(promises);

        for (let i = results.length - 1; i >= 0; i -= 1) {
            assert(results[i] === false, `Wallet ${voterWallets[i]} has approval!`);
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting too early', async () => {
        const expectedErrorMessage = 'Voting has not yet started';

        try {
            await voting.vote([new BN(0), new BN(1), new BN(2)], { from: accounts[0] });
            assert(false, 'Approval did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        try {
            await voting.voteWithProfile(
                [new BN(0), new BN(1), new BN(2)],
                identities[1],
                { from: accounts[1] },
            );
            assert(false, 'Approval did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by enabling voting from a non owner address', async () => {
        const expectedErrorMessage = 'Only contract owner can call this function';

        try {
            await voting.startVoting({ from: accounts[1] });
            assert(false, 'Enabling voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it('Should enable voting', async () => {
        await voting.startVoting();
        const votingClosingTime = await voting.votingClosingTime.call();
        assert(!votingClosingTime.isZero(), 'Voting closing time not set!');
    });

    // eslint-disable-next-line no-undef
    it('Should fail by enabling voting for a second time', async () => {
        const expectedErrorMessage = 'Voting already started once';

        try {
            await voting.startVoting();
            assert(false, 'Enabling voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by giving approval after the voting has started', async () => {
        const voterWallets = [accounts[0]];
        const voterIdentities = [identities[0]];

        const expectedErrorMessage = 'Voting already started';

        try {
            await voting.approveMultipleWallets(
                voterWallets,
                voterIdentities,
            );
            assert(false, 'Approval did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting with profile and not enough tokens in both', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        const expectedErrorMessage = 'Neither the sender nor the submitted profile have at least 1000 TRAC and thus cannot vote';

        const identity = await Identity.new(accounts[3], accounts[3]);
        // empty wallet
        let balance = await trac.balanceOf.call(accounts[3]);
        await trac.transfer(accounts[0], balance, { from: accounts[3] });

        const approval = await voting.walletApproved.call(accounts[3]);
        assert(approval === true, 'Wallet does not have approval');
        balance = await trac.balanceOf.call(accounts[3]);
        assert(balance.isZero(), 'Wallet balance not zero!');
        balance = await profileStorage.getStake.call(identity.address);
        assert(balance.isZero(), 'Wallet balance not zero!');

        try {
            await voting.voteWithProfile(
                votes,
                identity.address,
                { from: accounts[3] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        const walletVoted = await voting.walletVoted.call(accounts[3]);
        assert(walletVoted === false, 'Wallet marked as voted!');
        const identityVoted = await voting.walletVoted.call(identity.address);
        assert(identityVoted === false, 'Wallet profile marked as voted!');
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting without profile and not enough tokens', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        const expectedErrorMessage = 'Sender does not have at least 1000 TRAC and thus cannot vote';

        let balance = await trac.balanceOf.call(accounts[3]);
        await trac.transfer(accounts[0], balance, { from: accounts[3] });

        const approval = await voting.walletApproved.call(accounts[3]);
        assert(approval === true, 'Wallet does not have approval');
        balance = await trac.balanceOf.call(accounts[3]);
        assert(balance.isZero(), 'Wallet balance not zero!');

        try {
            await voting.vote(
                votes,
                { from: accounts[3] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        const walletVoted = await voting.walletVoted.call(accounts[3]);
        assert(walletVoted === false, 'Wallet marked as voted!');
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting with profile and without approval', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        const expectedErrorMessage = 'Sender is not approved and thus cannot vote';

        const approval = await voting.walletApproved.call(accounts[4]);
        assert(approval === false, 'Wallet has approval');

        try {
            await voting.voteWithProfile(
                votes,
                identities[4],
                { from: accounts[4] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        const walletVoted = await voting.walletVoted.call(accounts[4]);
        assert(walletVoted === false, 'Wallet marked as voted!');
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting without profile and without approval', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        const expectedErrorMessage = 'Sender is not approved and thus cannot vote';

        const approval = await voting.walletApproved.call(accounts[4]);
        assert(approval === false, 'Wallet has approval');

        try {
            await voting.vote(
                votes,
                { from: accounts[4] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        const walletVoted = await voting.walletVoted.call(accounts[4]);
        assert(walletVoted === false, 'Wallet marked as voted!');
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting with profile and without management permissions', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        const expectedErrorMessage = 'Sender is not the management wallet for this ERC725 identity';

        const approval = await voting.walletApproved.call(accounts[1]);
        assert(approval === true, 'Wallet does not have approval');

        try {
            await voting.voteWithProfile(
                votes,
                identities[0],
                { from: accounts[1] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        const walletVoted = await voting.walletVoted.call(accounts[1]);
        assert(walletVoted === false, 'Wallet marked as voted!');
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting with something other than 3 candidates selected', async () => {
        let votes = [new BN(0), new BN(1), new BN(2), new BN(3)];

        const expectedErrorMessage = 'Must vote for 3 candidates';

        const approval = await voting.walletApproved.call(accounts[1]);
        assert(approval === true, 'Wallet does not have approval');

        try {
            await voting.voteWithProfile(
                votes,
                identities[0],
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        try {
            await voting.vote(
                votes,
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        votes = [new BN(0), new BN(1)];

        try {
            await voting.voteWithProfile(
                votes,
                identities[0],
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        try {
            await voting.vote(
                votes,
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        votes = [];

        try {
            await voting.voteWithProfile(
                votes,
                identities[0],
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        try {
            await voting.vote(
                votes,
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        const walletVoted = await voting.walletVoted.call(accounts[0]);
        assert(walletVoted === false, 'Wallet marked as voted!');
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting for a non existing candidate', async () => {
        const votes = [new BN(0), new BN(1), new BN(34)];

        const expectedErrorMessage = 'The selected candidate does not exist';

        const approval = await voting.walletApproved.call(accounts[0]);
        assert(approval === true, 'Wallet does not have approval');

        try {
            await voting.voteWithProfile(
                votes,
                identities[0],
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        try {
            await voting.vote(
                votes,
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        const walletVoted = await voting.walletVoted.call(accounts[0]);
        assert(walletVoted === false, 'Wallet marked as voted!');
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting for selecting the same candidate for multiple votes', async () => {
        const votes = [new BN(0), new BN(0), new BN(0)];

        const expectedErrorMessage = 'Cannot cast multiple votes for the same person';

        const approval = await voting.walletApproved.call(accounts[0]);
        assert(approval === true, 'Wallet does not have approval');

        try {
            await voting.voteWithProfile(
                votes,
                identities[0],
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        try {
            await voting.vote(
                votes,
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        const walletVoted = await voting.walletVoted.call(accounts[0]);
        assert(walletVoted === false, 'Wallet marked as voted!');
    });

    // eslint-disable-next-line no-undef
    it('Should vote with profile and enough tokens in both', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        let promises = [];
        for (let i = 0; i < 3; i += 1) {
            promises[i] = voting.candidates.call(i);
        }
        const initialVotes = await Promise.all(promises);
        for (let i = 0; i < 3; i += 1) {
            initialVotes[i] = initialVotes[i].votes;
        }

        const approval = await voting.walletApproved.call(accounts[0]);
        assert(approval === true, 'Wallet does not have approval');

        await voting.voteWithProfile(
            votes,
            identities[0],
            { from: accounts[0] },
        );

        const walletVoted = await voting.walletVoted.call(accounts[0]);
        assert(walletVoted === true, 'Wallet marked as not yet voted!');
        const identityVoted = await voting.walletVoted.call(accounts[0]);
        assert(identityVoted === true, 'Identity marked as not yet voted!');

        promises = [];
        for (let i = 0; i < 3; i += 1) {
            promises[i] = voting.candidates.call(i);
        }
        const finalVotes = await Promise.all(promises);
        for (let i = 0; i < 3; i += 1) {
            finalVotes[i] = finalVotes[i].votes;
            assert(
                finalVotes[i].eq(initialVotes[i].add(new BN(3 - i))),
                `Candidate votes not changed correclty! Got ${finalVotes[i].toString()} but expected ${initialVotes[i].add(new BN(3 - i))}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it('Should vote with profile and enough tokens in profile', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        let promises = [];
        for (let i = 0; i < 3; i += 1) {
            promises[i] = voting.candidates.call(i);
        }
        const initialVotes = await Promise.all(promises);
        for (let i = 0; i < 3; i += 1) {
            initialVotes[i] = initialVotes[i].votes;
        }

        const approval = await voting.walletApproved.call(accounts[emptyWalletFullProfile]);
        assert(approval === true, 'Wallet does not have approval');

        await voting.voteWithProfile(
            votes,
            identities[emptyWalletFullProfile],
            { from: accounts[emptyWalletFullProfile] },
        );

        const walletVoted = await voting.walletVoted.call(accounts[emptyWalletFullProfile]);
        assert(walletVoted === true, 'Wallet marked as not yet voted!');
        const identityVoted = await voting.walletVoted.call(accounts[emptyWalletFullProfile]);
        assert(identityVoted === true, 'Identity marked as not yet voted!');

        promises = [];
        for (let i = 0; i < 3; i += 1) {
            promises[i] = voting.candidates.call(i);
        }
        const finalVotes = await Promise.all(promises);
        for (let i = 0; i < 3; i += 1) {
            finalVotes[i] = finalVotes[i].votes;
            assert(
                finalVotes[i].eq(initialVotes[i].add(new BN(3 - i))),
                `Candidate votes not changed correclty! Got ${finalVotes[i].toString()} but expected ${initialVotes[i].add(new BN(3 - i))}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it('Should vote with profile and enough tokens in wallet', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        let promises = [];
        for (let i = 0; i < 3; i += 1) {
            promises[i] = voting.candidates.call(i);
        }
        const initialVotes = await Promise.all(promises);
        for (let i = 0; i < 3; i += 1) {
            initialVotes[i] = initialVotes[i].votes;
        }

        const approval = await voting.walletApproved.call(accounts[fullWalletEmptyProfile]);
        assert(approval === true, 'Wallet does not have approval');

        await voting.voteWithProfile(
            votes,
            identities[fullWalletEmptyProfile],
            { from: accounts[fullWalletEmptyProfile] },
        );

        const walletVoted = await voting.walletVoted.call(accounts[fullWalletEmptyProfile]);
        assert(walletVoted === true, 'Wallet marked as not yet voted!');
        const identityVoted = await voting.walletVoted.call(accounts[fullWalletEmptyProfile]);
        assert(identityVoted === true, 'Identity marked as not yet voted!');

        promises = [];
        for (let i = 0; i < 3; i += 1) {
            promises[i] = voting.candidates.call(i);
        }
        const finalVotes = await Promise.all(promises);
        for (let i = 0; i < 3; i += 1) {
            finalVotes[i] = finalVotes[i].votes;
            assert(
                finalVotes[i].eq(initialVotes[i].add(new BN(3 - i))),
                `Candidate votes not changed correclty! Got ${finalVotes[i].toString()} but expected ${initialVotes[i].add(new BN(3 - i))}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it('Should vote without profile and enough tokens', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        let promises = [];
        for (let i = 0; i < 3; i += 1) {
            promises[i] = voting.candidates.call(i);
        }
        const initialVotes = await Promise.all(promises);
        for (let i = 0; i < 3; i += 1) {
            initialVotes[i] = initialVotes[i].votes;
        }

        const approval = await voting.walletApproved.call(accounts[1]);
        assert(approval === true, 'Wallet does not have approval');

        await voting.vote(
            votes,
            { from: accounts[1] },
        );

        const walletVoted = await voting.walletVoted.call(accounts[1]);
        assert(walletVoted === true, 'Wallet marked as not yet voted!');

        promises = [];
        for (let i = 0; i < 3; i += 1) {
            promises[i] = voting.candidates.call(i);
        }
        const finalVotes = await Promise.all(promises);
        for (let i = 0; i < 3; i += 1) {
            finalVotes[i] = finalVotes[i].votes;
            assert(
                finalVotes[i].eq(initialVotes[i].add(new BN(3 - i))),
                `Candidate votes not changed correclty! Got ${finalVotes[i].toString()} but expected ${initialVotes[i].add(new BN(3 - i))}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting multiple times', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        const expectedErrorMessage = 'Sender already voted';

        const approval = await voting.walletApproved.call(accounts[0]);
        assert(approval === true, 'Wallet does not have approval');
        const voted = await voting.walletVoted.call(accounts[0]);
        assert(voted === true, 'Wallet marked as not yet voted');

        try {
            await voting.voteWithProfile(
                votes,
                identities[0],
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        try {
            await voting.vote(
                votes,
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it('Should fail by voting with the same profile multiple times', async () => {
        const votes = [new BN(0), new BN(1), new BN(2)];

        const expectedErrorMessage = 'Profile was already used for voting';

        const identity = await Identity.at(identities[0]);
        const key = await util.keccakAddress(accounts[3]);
        await identity.addKey(key, [new BN(1)], new BN(1));

        const approval = await voting.walletApproved.call(accounts[3]);
        assert(approval === true, 'Wallet does not have approval');
        const voted = await voting.walletVoted.call(accounts[3]);
        assert(voted === false, 'Wallet marked as not yet voted');

        try {
            await voting.voteWithProfile(
                votes,
                identities[0],
                { from: accounts[3] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }
    });

    // eslint-disable-next-line no-undef
    it.skip('Should fail by voting after the voting has finished', async () => {
        // This test is skipped due to the fact that it uses a modified contract when running
        const votes = [new BN(0), new BN(1), new BN(2)];

        const expectedErrorMessage = 'Voting period has expired';

        await new Promise(resolve => setTimeout(resolve, 10000));

        try {
            await voting.voteWithProfile(
                votes,
                identities[0],
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }

        try {
            await voting.vote(
                votes,
                { from: accounts[0] },
            );
            assert(false, 'Voting did not fail!');
        } catch (error) {
            assert(
                error.toString().includes(expectedErrorMessage),
                `Incorrect error thrown! Received: \n${error}`,
            );
        }
    });
});
