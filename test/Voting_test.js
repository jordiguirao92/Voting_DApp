Web3 = require('web3');

const Voting = artifacts.require('Voting');

contract ('Voting', function(accounts){

    let votingInstance; 
   
    const votingInfo = {
        totalTokens: 1000,
        tokenPrice: web3.toWei('0.01', 'ether'),
        candidateList: ['Juan', 'Maria', 'Pablo'],
        voting_owner: 0x345503ce4B472cE35186AA87A9C6e600C94Bcf71,
    }


    beforeEach(async () => {
        votingInstance = await Voting.new(1000, web3.toWei('0.1', 'ether'), ['Juan', 'Maria', 'Pablo']);
    });


    it("Comprobando el owner del contrato", async() => {
        const owner = await votingInstance.get_owner({ from: accounts[0] });

        assert.equal(owner, votingInfo.voting_owner, "La dirección del owner ha de ser la misma que en el constructor");
    })


    it("Revisando la lista de candidatos y total de tokens", async() => {
        const candidates = await votingInstance.allCandidates({from: accounts[0]});
        const tokens = await votingInstance.totalTokens.call();
        const balance = await votingInstance.balanceTokens.call();

        assert.equal(candidates[0],votingInfo.candidateList[0], "El candidato Juan no coincide");
        assert.equal(candidates[1],votingInfo.candidateList[1], "El candidato Maria no coincide");
        assert.equal(candidates[2],votingInfo.candidateList[2], "El candidato Pablo no coincide");
        assert.equal(tokens,votingInfo.totalTokens, "El número total de tokens no es coincide");
        assert.equal(balance,votingInfo.totalTokens, "El balance de tokens no coincide");

    })


    it("Comprando tokens", async() => {
        await votingInstance.buy({ from: accounts[1], value: web3.toWei('1', 'ether') });
        const voterAddress = await votingInstance.voterInfo[accounts[1]].voterAddress.call();
        const boughtTokens = await votingInstance.voterInfo[accounts[1]].tokensBought.call();
        const balance = await votingInstance.balanceTokens.call();
        
        assert.equal(voterAddress, accounts[1], "La dirección no coincide");
        assert.equal(100, boughtTokens, "Los tokens comprados no coinciden");
        assert.equal(900, balance, "Los tokens comprados no coinciden");
    })
    

    it("Votando a un candidato", async() => {
        await votingInstance.voteForCandidate('Juan', 15, { from: accounts[1] });
        const voteTokensCandidate = await votingInstance.totalVotesFor('Juan', {from: accounts[1]});
        const tokensUsedCandidate = await votingInstance.voterInfo[accounts[1]].tokensUsedPerCandidate[0];
        
        assert.equal(voteTokensCandidate, 15, "Número de votos correctos");
        assert.equal(tokensUsedCandidate, 15, "Número de votos correctos");
    })


});

