// Import the page's CSS. Webpack will know what to do with it.
//import "../css/index.css";
//import { default as Web3} from 'web3';
//Web3 = require('web3');
//import { default as contract } from 'truffle-contract'
//var contract = require("truffle-contract");
//import voting_artifacts from '../../build/contracts/Voting.json'

let web3;
let web3Provider;
let Voting;
let candidates = {}
let tokenPrice = null;


async function init() {
    if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.enable();
          console.log("Account access OK");
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      
      web3 = new Web3(web3Provider);
      console.log(web3Provider);
      
      const data = await $.getJSON('Voting.json');
      console.log(data);
      var voting_artifacts = data;
      Voting = TruffleContract(voting_artifacts);
      console.log("data ok");
      console.log("Truffle contract ok");
      Voting.setProvider(web3Provider);
    
      return populateCandidates();
}


async function populateCandidates() {
    let voting = await Voting.deployed();
    let candidateArray = await voting.allCandidates.call();
    for(let i=0; i < candidateArray.length; i++) {
        candidates[web3.toUtf8(candidateArray[i])] = "candidate-" + i; //Usamos el método toUtf8 para convertir de bytes32 a string
      }

    populateCandidateVotes();
    setupCandidateRows();
    populateTokenData();
}


async function populateCandidateVotes() {
    let candidateNames = Object.keys(candidates);
  
    for (var i = 0; i < candidateNames.length; i++) {
      let name = candidateNames[i];
      let voting = await Voting.deployed();
      let totalVotes = await voting.totalVotesFor.call(name);
      $("#" + candidates[name]).html(totalVotes.toString());
    }
}
  
  
function setupCandidateRows() {
    Object.keys(candidates).forEach(function (candidate) { 
        $("#candidate-rows").append("<tr><td>" + candidate + "</td><td id='" + candidates[candidate] + "'></td></tr>");
    });
}


async function populateTokenData() {
    let voting = await Voting.deployed();

    let totalTokens = await voting.totalTokens.call();
    $("#tokens-total").html(totalTokens.toString());

    let totalSold = await voting.tokensSold();
    $("#tokens-sold").html(totalSold.toString());

    let price = await voting.tokenPrice.call();
    tokenPrice = parseFloat(web3.fromWei(price.toString()));
    $("#token-cost").html(tokenPrice + " Ether");

    web3.eth.getBalance(voting.address, function(error, result) {
      $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
    });
}



window.voteForCandidate = async function(candidate) {
  let candidateName = $("#candidate").val();
  let voteTokens = $("#vote-tokens").val();
  $("#msg").html("Tu voto ha sido enviado a la blockchain.")
  $("#candidate").val("");
  $("#vote-tokens").val("");

  let voting = await Voting.deployed();
  await voting.voteForCandidate(candidateName, voteTokens, {from: web3.eth.accounts[0]});
  let div_id = candidates[candidateName];

  let totalVotes = await voting.totalVotesFor.call(candidateName);
  $("#" + div_id).html(totalVotes.toString());
  $("#msg").html("");

}


window.buyTokens = async function() {
  let tokensToBuy = $("#buy").val();
  let price = tokensToBuy * tokenPrice;
  $("#buy-msg").html("Tu compro se esta tramitando en la Blockchain.");

  let voting = await Voting.deployed();
  await voting.buy({value: web3.toWei(price, 'ether'), from: web3.eth.accounts[0]});
  $("#buy-msg").html("");


  populateTokenData();
}


window.lookupVoterInfo = async function() {
  let address = $("#voter-info").val();

  let voting = await Voting.deployed();
  let details = await voting.voterDetails.call(address);
  $("#tokens-bought").html("Total Tokens bought: " + details[0].toString());

  let votesPerCandidate = details[1];
  $("#votes-cast").empty();
  $("#votes-cast").append("Votes cast per candidate: <br>");

  let allCandidates = Object.keys(candidates);
  for(let i=0; i < allCandidates.length; i++) {
    $("#votes-cast").append(allCandidates[i] + ": " + votesPerCandidate[i] + "<br>");
  }
}