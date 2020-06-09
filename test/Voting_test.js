Web3 = require('web3');

const Voting = artifacts.require('Voting');

contract ('Voting', function(accounts){

    let votingInstance; 
   
    const votingInfo = {
        totalTokens: 1000,
        tokenPrice: Web3.utils.toWei('0.1', 'ether'),
        candidateList: [Web3.utils.asciiToHex('Juan'), Web3.utils.asciiToHex('Maria'), Web3.utils.asciiToHex('Pablo')],
        voting_owner: 0x59b5929ac70aDb06396Cdb128F990cd2D9A1519b,
    }
    


    beforeEach(async () => {
        votingInstance = await Voting.new(1000, Web3.utils.toWei('0.01', 'ether'), [Web3.utils.asciiToHex('Juan'), Web3.utils.asciiToHex('Maria'),  Web3.utils.asciiToHex('Pablo')]);
    });


    it("Comprobando el owner del contrato", async() => {
        const owner = await votingInstance.get_owner({ from: accounts[0] });

        assert.equal(owner, votingInfo.voting_owner, "La dirección del owner ha de ser la misma que en el constructor");
    })


    it("Revisando la lista de candidatos y total de tokens", async() => {
        const candidates = await votingInstance.allCandidates({from: accounts[0]});
        const tokens = await votingInstance.totalTokens.call();
        const balance = await votingInstance.balanceTokens.call();

        assert.equal(candidates[0], votingInfo.candidateList[0].padEnd(66, 0), "El candidato Juan no coincide");
        assert.equal(candidates[1], votingInfo.candidateList[1].padEnd(66, 0), "El candidato Maria no coincide");
        assert.equal(candidates[2], votingInfo.candidateList[2].padEnd(66, 0), "El candidato Pablo no coincide");
        assert.equal(tokens,votingInfo.totalTokens, "El número total de tokens no es coincide");
        assert.equal(balance,votingInfo.totalTokens, "El balance de tokens no coincide");

    })


    it("Comprando tokens", async() => {
        await votingInstance.buy({ from: accounts[1], value: Web3.utils.toWei('2', 'ether') });
        const voterInformation = await votingInstance.voterInfo.call(accounts[1])
        const balance = await votingInstance.balanceTokens.call();
        
        assert.equal(voterInformation[0], accounts[1], "La dirección no coincide");
        assert.equal(200, voterInformation[1], "Los tokens comprados no coinciden");
        assert.equal(800, balance, "Los tokens comprados no coinciden");
    })
    

    it("Votando a un candidato", async() => {
        await votingInstance.buy({ from: accounts[1], value: Web3.utils.toWei('2', 'ether') });
        await votingInstance.voteForCandidate(Web3.utils.asciiToHex('Juan'), 15, { from: accounts[1] });
        const voteTokensCandidate = await votingInstance.totalVotesFor(Web3.utils.asciiToHex('Juan'), {from: accounts[1]});
        const tokensUsedCandidate = await votingInstance.voterDetails(accounts[1]);
        
        assert.equal(voteTokensCandidate, 15, "Número de votos correctos");
        assert.equal(tokensUsedCandidate[1][0], 15, "Número de votos correctos");
    })


});

