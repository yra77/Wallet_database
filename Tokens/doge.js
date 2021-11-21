//var dogecoin = require('node-dogecoin')();
const axios = require ("axios"); 
const dogecore = require ("bitcore-lib-doge");

const sochain_network = "DOGE";
 
module.exports.GetBalance = async(walletKey)=>
   {
      let balance = 0;
        const utxos = await axios.get
        (
           'https://sochain.com/api/v2/get_tx_unspent/'+ sochain_network + '/' + walletKey
        );
         
          utxos.data.data.txs.forEach(async (element) => 
          {
             balance += Number(element.value);
          });
     
         return balance;
   }

module.exports.CreateKeys = async(str) => 
{
   var value = Buffer.from(str);
   var hash = dogecore.crypto.Hash.sha256(value);
   var bn = dogecore.crypto.BN.fromBuffer(hash);
   var privateKey = new dogecore.PrivateKey(bn).toWIF();
   var address = new dogecore.PrivateKey(bn).toAddress();

   if (dogecore.Address.isValid(address))//, Networks.testnet))
   {
      return {"dogecoin" : {"privateKey": privateKey, "address":address.toString()}};
  }
          else
          {
           console.log("Error string dogecoin.");
           return "0";
          }

}

  module.exports.Send = async(walletKey, privateKey, recieverAddress, amountToSend)=> 
  {
   if (!bitcore.Address.isValid(recieverAddress))//, Networks.testnet))
   {
       return "Error address dogecoin.";
   }
    const satoshiToSend = amountToSend * 100000000; 
    let fee = 0; 
    let inputCount = 0;
    let outputCount = 2;
    const countSatoshiPerByte = 2; 
    const utxos = await axios.get
    (
        'https://sochain.com/api/v2/get_tx_unspent/'+ sochain_network + '/' + walletKey
    );
    // console.log(utxos.data.data.txs);
    const transaction = new dogecore.Transaction();

    let totalAmountAvailable = 0;

    let inputs = [];
    utxos.data.data.txs.forEach(async (element) => 
    {
      let utxo = {};
      utxo.satoshis = Math.floor(Number(element.value) * 100000000);
      utxo.script = element.script_hex;
      utxo.address = utxos.data.data.address;
      utxo.txId = element.txid;
      utxo.outputIndex = element.output_no;
      totalAmountAvailable += utxo.satoshis;
      inputCount += 1;
      inputs.push(utxo);
    });
    //148×2 + 34×2 + 10 = 374 
    transactionSize = inputCount * 148 + outputCount * 34 + 10 - inputCount;
    // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte
    fee = transactionSize * 20000
    if (totalAmountAvailable - satoshiToSend - fee  < 0) 
    {
       return ("Balance is too low for this transaction.");
    }
  
    transaction.from(inputs);
    transaction.to(recieverAddress, satoshiToSend);
    transaction.change(walletKey);
    transaction.fee(fee * countSatoshiPerByte);
    transaction.sign(privateKey);
    const serializedTransaction = transaction.serialize();
    // Send transaction
    const result = await axios
    ({
      method: "POST",
      url: 'https://sochain.com/api/v2/send_tx/'+ sochain_network,
      data: 
      {
        tx_hex: serializedTransaction,
      },
    });

    return result.data.data['txid'];

  }

     //real
//privateKey - QW84jYGwRgnB8dBHm7S4RyiS2z89hsJascCodfp4LR3TPGcUb56y
//address - D855iE9yH92EHorXazxPWxt7t9wMWRVreT

//test
// private - cmbLFzRJezB1q1GH6BrC7Wafiwfxy2164876tQTk4nFJuq4giaKa
//  address - nfXfLSPYR5rVvmf3u8wveoySTT6HGsiQQ7
//  balance - 135.21300000

//7edeb3e262d3f9781756755d67efb1126d49c6f8cf1e2e68e46c1a9a01f5ff61
//D9AQm95jaegPpcisVz3SuoUu5mb1T6mU5K
// balance - 0;
  
//privateKey - ceqT8RSWHAwqnpvK5Qcc2nB2o826gyriBFxxDFjJNcd9wMYUP1FP
//address - njbokcv2GT6torfxgUhz99zguNk8zUmEq7

//dogeWallet.SendDogecoin('njbokcv2GT6torfxgUhz99zguNk8zUmEq7', 100);