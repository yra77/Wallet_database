
const common = require('ethereumjs-common');
const Tx = require('ethereumjs-tx').Transaction;
const ethers = require('ethers');
const Web3 = require('web3');
const contractABI = require('../ABI/bep20ABI').abi;
       

let contractAddress = {
                       "busd": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"//
                       //"busd" : "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee"
                      };

//providers
 const web3 = new Web3('https://bsc-dataseed1.binance.org:443');// mainnet
// const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545'); // testnet

 const contract = new web3.eth.Contract(contractABI, contractAddress['busd']);


 module.exports.GetBalanceBNB = async(address)=>
{
   const balance = web3.eth.getBalance(address);
  // balance.then(console.log);
      return balance;
}

module.exports.GetBalanceBep20 = async(address)=>
{
   const balance = contract.methods.balanceOf(address).call();  
  // balance.then(console.log);
      return balance;
}

module.exports.CreateKeys = async(str)=>
{
    var mnemonic = ethers.utils.mnemonicToSeed(str);
    var accounts = ethers.utils.HDNode.fromSeed(mnemonic);
   
    if(web3.utils.isAddress(accounts.address))
    {
       return { "bep20": { "privateKey": accounts.privateKey, "address": accounts.address } };
    }
    else 
    {
      console.log("Error string bep20.");
      return "0";
    }
 
}

module.exports.AmountFee = async()=>
{      
     return web3.utils.fromWei((await web3.eth.getGasPrice()*21000).toString(), 'ether');     
}

module.exports.SendBNB = async(fromAddress, privateKey, toAddress, amount)=>
{
   if(!web3.utils.isAddress(toAddress))
   {
     return "Error address bep20.";
   }
    var gasprice = await web3.eth.getGasPrice();
    amount = web3.utils.toHex(amount*1000000000000000000);//10000000000000000000//web3.utils.toBN(amount*1000000000000000000);
    web3.eth.accounts.wallet.add(privateKey);

    //this.AmountFee().then(gasPrice =>{console.log("This fee = " + gasPrice + " eth.");});

   const result = await web3.eth.sendTransaction(
    {
        from: fromAddress,
        to: toAddress,
        value: amount,
        gas: 100000,
        gasPrice: gasprice,
     })
     .catch(function (e) 
    {
            console.log(e.message);
    })
    .finally()
    {
    if(result)
    {
        return result.transactionHash;
        //console.log(`transactionhash ${result.transactionHash}`);
    }
    else
       return 'insufficient funds.';
    }
    
}

module.exports.SendBep20 = async(fromAddress, privateKey, toAddress, amount)=>
{
  if(!web3.utils.isAddress(toAddress))
  {
    return "Error address bep20.";
  }
    var gasprice = await web3.eth.getGasPrice();
    const count = await web3.eth.getTransactionCount(fromAddress);
    amount = web3.utils.toHex(amount*1000000000000000000);//10000000000000000000//web3.utils.toBN(amount*1000000000000000000);//
                                    //1000000000000000000

    //this.AmountFee().then(gasPrice =>{console.log("This fee = " + gasPrice + " eth.");});

    var rawTransaction = 
    { 
        "from": fromAddress, 
        "gasPrice": web3.utils.toHex(gasprice), 
        "gasLimit": web3.utils.toHex(100000), 
        "to": contractAddress['busd'], 
        "value": "0x0", 
        "data": contract.methods.transfer(toAddress, amount).encodeABI(), 
        "nonce": web3.utils.toHex(count),
        //"chainId": 97
    };
    const customCommon = common.default.forCustomChain(
        'mainnet',
        {
          name: 'BSCTestnet',
          networkId: 97,
          chainId: 97,
        },
        'petersburg',
      )

    var transaction = new Tx(rawTransaction,{ common: customCommon });
    var privKeyBuffer = new Buffer.from(privateKey.substring(2), 'hex');
    transaction.sign(privKeyBuffer);

    const result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
    .catch(function (e) 
    {
            console.log(e.message);
    })
    .finally()
    {
    if(result)
    {
        return result.transactionHash;
    }
    else
       return 'insufficient funds for bnb';
    }
   
}
