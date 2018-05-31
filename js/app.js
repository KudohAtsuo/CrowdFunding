if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}


var abi = [ { "constant": true, "inputs": [], "name": "ended", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "numInvestors", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalAmount", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "status", "outputs": [ { "name": "", "type": "string", "value": "Funding" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "goalAmount", "outputs": [ { "name": "", "type": "uint256", "value": "10" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "addressToAmount", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "ownerOfContract", "outputs": [ { "name": "", "type": "address", "value": "0x3b13e4513aac5ac3efec497926e8dca71e6ba7b4" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "closingTime", "outputs": [ { "name": "", "type": "uint256", "value": "1527745267" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "checkGoal", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_duration", "type": "uint256" }, { "name": "_goalAmount", "type": "uint256" } ], "name": "CroudFunding", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "invest", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "isReached", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" } ];

var myContractAddress = "0x85CDC4886226c9E0ced429C5f5cc6D0e502AeDdE";
var myContractInstance;

myContractInstance = web3.eth.contract(abi).at(myContractAddress);


$("#c_address").html(myContractAddress);




//callback hell
myContractInstance.goalAmount(function(error, result){
  if(!error){
    $("#fundGoal").html(web3.fromWei(result.toString(), "ether"));
    myContractInstance.totalAmount(function(error, result){
      if(!error){
        $("#fundRaised").html(web3.fromWei(result.toString(), "ether"));
        myContractInstance.numInvestors(function(error, result){
          if(!error){
            $("#fundBackers").html(result.toString());
          } else {
            console.log(error);
          }
        });
      } else {
        console.log(error);
      }
    });
  } else {
    console.log(error);
  }
});



myContractInstance.closingTime(function(error, result){
  if(!error){
    $("#fundDeadline").html(result.toString());
  } else {
    console.log(error);
  }
});

myContractInstance.status(function(error, result){
  if(!error){
    $("#fundStatus").html(result);
  } else {
    console.log(error);
  }
});

web3.eth.getAccounts(function(error, result){
  if(!error){
    $("#cb_address").html(result[0]);
    web3.eth.getBalance(result[0], function(error, balance){
      if(!error)
        $("#cb_balance").html(web3.fromWei(balance.toString(), "ether"));
      else
        console.log(error);
      });
  } else {
    console.log(error);
  }
});

$('#qrcode').qrcode({width: 250, height: 250, text: myContractAddress});

function contribute(){
  web3.eth.getAccounts(function(error, result){
    if(!error){
      var investingAmount = $("#amount").val();
      myContractInstance.invest.sendTransaction({from: result[0], value: web3.toWei(investingAmount, "ether")}, function(error, _amount) {
        if(!error){
          console.log(_amount);
        } else {
          console.log(error);
        }
      });
    } else {
      console.log(error);
    }
  });
}

function check(){
  web3.eth.getAccounts(function(error, result){
    if(!error){
      myContractInstance.checkGoal.sendTransaction({from:result[0]}, function(error, result){
        if(!error){
          console.log(result);
        } else {
          console.log(error);
        }
      });
    } else {
      console.log(error);
    }
  });
}

function withdraw(){
  web3.eth.getAccounts(function(error, result){
    if(!error){
      myContractInstance.withdraw.sendTransaction({from:result[0]}, function(error, result){
        if(!error){
          console.log(result);
        } else {
          console.log(error);
        }
      });
    } else {
      console.log(error);
    }
  });
}
