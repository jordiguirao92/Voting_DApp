// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import voting_artifacts from '../../build/contracts/Voting.json'

let web3;
let web3Provider;
let Voting = contract(voting_artifacts);
console.log("Truffle contract ok");
let candidates = {}
let tokenPrice = null;


$( document ).ready(function() {
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
      Voting.setProvider(web3Provider);
    
      return populateCandidates();
});


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

    let totalTokens = await voting.totalTokens();
    $("#tokens-total").html(totalTokens.toString());

    let totalSold = await voting.tokensSold.call();
    $("#tokens-sold").html(totalSold.toString());

    let price = voting.tokenPrice();
    tokenPrice = parseFloat(web3.fromWei(price.toString()));
    $("#token-cost").html(tokenPrice + " Ether");

    let balance = await web3.eth.getBalance(voting.address);
    $("#contract-balance").html(web3.fromWei(balance.toString()) + " Ether");
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

  let balance = await web3.eth.getBalance(voting.address);
  $("#contract-balance").html(web3.fromWei(balance.toString()) + " Ether");

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









/*
$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Voting.setProvider(web3.currentProvider);
  populateCandidates();

});
*/