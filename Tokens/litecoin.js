const axios = require ("axios"); 
const litecore = require ("litecore-lib");


const sochain_network = "LTC";


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

 module.exports.CreateKeys = async(str)=>
 {
   var value = Buffer.from(str);
   var hash = litecore.crypto.Hash.sha256(value);
   var bn = litecore.crypto.BN.fromBuffer(hash);
   var privateKey = new litecore.PrivateKey(bn).toWIF();
   var address = new litecore.PrivateKey(bn).toAddress();

   if (litecore.Address.isValid(address))//, Networks.testnet))
   {
     return { "litecoin": { "privateKey": privateKey, "address": address.toString() } };
   }
   else 
   {
     console.log("Error string litecoin.");
     return "0";
   }

 }

  module.exports.Send = async(walletKey, privateKey, recieverAddress, amountToSend)=> 
  {
    if (!litecore.Address.isValid(recieverAddress))//, Networks.testnet))
    {
        return "Error address litecoin.";
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
     //console.log(utxos.data.data.txs);
    const transaction = new litecore.Transaction();

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
  
    fee = transactionSize * 20
    if (totalAmountAvailable - satoshiToSend - fee  < 0) 
    {
      return ("Balance is too low for this transaction.");//throw new Error("Balance is too low for this transaction");
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

  // const privateKey = 'c42afb1c20a88d4beaeb26452eeca22518a77c1614a67d6e7b79058085c41963';
  // const walletKey = 'myMpXddjnrX4ivDa6Ejc1vcGG82p4mCJgB';    
  // const sochain_network = "LTCTEST"; // real net = LTC
//c42afb1c20a88d4beaeb26452eeca22518a77c1614a67d6e7b79058085c41963
//myMpXddjnrX4ivDa6Ejc1vcGG82p4mCJgB

//7b5f957fd1e70f91bee514dc92f4de3657cfbe4ac6e7362760ac63301141cd32
//mjUENykcbTXcmifEdwe8JFVZ7FHkK3Xgx9

//liteWallet.SendLitecoin('mjUENykcbTXcmifEdwe8JFVZ7FHkK3Xgx9', 0.2);