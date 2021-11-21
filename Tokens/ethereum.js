
//const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const ethers = require('ethers');

const web3 = new Web3('https://mainnet.infura.io/v3/dc0b759838f44e9fa4c4ae26d541d6e8');//mainnet

module.exports.GetBalance = async(address)=>
{
   const balance = web3.eth.getBalance(address);
  // balance.then(console.log);
      return balance;
}

module.exports.CreateKeys = async(str)=>
{
   //const accounts = web3.eth.accounts.create();
   var mnemonic = ethers.utils.mnemonicToSeed(str);
   var accounts = ethers.utils.HDNode.fromSeed(mnemonic);
   
   if(web3.utils.isAddress(accounts.address))
   {
      return { "ethereum": { "privateKey": accounts.privateKey, "address": accounts.address } };
   }
   else 
   {
     console.log("Error string ethereum.");
     return "0";
   }

}

module.exports.AmountFee = async()=>
{      
     return web3.utils.fromWei((await web3.eth.getGasPrice()*21000).toString(), 'ether');     
}

module.exports.Send = async(fromAddress, privKey, toAddress, amount)=>
{
 
   if(!web3.utils.isAddress(toAddress))
   {
     return "Error address ethereum.";
   }

      const createTransaction = await web3.eth.accounts.signTransaction
      ({
         from: fromAddress,
         to: toAddress,
         value:  web3.utils.toHex(web3.utils.toWei(amount, "ether")),
         gas:  web3.utils.toHex('50000'),
      },
      privKey
      );

   
      var hash = '';
         // Deploy transaction
      await web3.eth.sendSignedTransaction(createTransaction.rawTransaction).then(createReceipt =>
      {
            if(createReceipt.transactionHash)
                  hash = "Transaction hash: " + createReceipt.transactionHash;  
        
         //fee after transaction
         //   web3.eth.getTransaction(createReceipt.transactionHash).then(gasPrice =>
         // {
         //    web3.eth.getTransactionReceipt(createReceipt.transactionHash).then(gasUsed =>
         //       {
         //          console.log(gasUsed.gasUsed + "\n" + gasPrice.gasPrice);
         //          console.log("this fee = " + web3.utils.fromWei(((Number(gasPrice.gasPrice) * Number(gasUsed.gasUsed)).toString()), 'ether') + "eth");
         //       });
         // });
      })
       .catch(e=>{hash = e.message});
      
      return hash;
}

// const privKey = "0xd6836600de660f6820b828b30736a4937800d6a449c5a9935ef8c254ce19bf25";//'0x9aaf3cac8c11992b4b86787cf08ccdb628796cff2f72ee7b61e35704c347d3d8';
// const toAddress = '0xDAf789294f9927B9B5A07Aba267d8840930D8dB9';
// const fromAddress = '0x60A1aE9127E556401533E2Df8746649c153dA448';
//this.SendEther(privKey, fromAddress, toAddress, '0.002');

//var BN = web3.utils.BN;

//this.AmountFee().then(gasPrice =>{console.log("This fee = " + gasPrice + " eth.");});//new BN(1234).toString()

//ropsten
 //0x60A1aE9127E556401533E2Df8746649c153dA448
//0xd6836600de660f6820b828b30736a4937800d6a449c5a9935ef8c254ce19bf25
 
 //address: '0xDAf789294f9927B9B5A07Aba267d8840930D8dB9', //0.3eth  = 300000000000000000 wei
                                                         // 1 ether = 1000000000000000000 wei
  //privateKey: '0x9aaf3cac8c11992b4b86787cf08ccdb628796cff2f72ee7b61e35704c347d3d8',
//const accounts = web3.eth.getAccounts();
