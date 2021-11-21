const axios = require ("axios"); 
const bitcore = require ("bitcore-lib");

const sochain_network = "BTC";//"BTCTEST";

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
  var hash = bitcore.crypto.Hash.sha256(value);
  var bn = bitcore.crypto.BN.fromBuffer(hash);
  var privateKey = new bitcore.PrivateKey(bn).toWIF();
  var address = new bitcore.PrivateKey(bn).toAddress();

  if (bitcore.Address.isValid(address))//, Networks.testnet))
  {
      return {"bitcoin" : {"privateKey": privateKey, "address":address.toString()}};
  }
          else
          {
           console.log("Error string bitcoin.");
           return "0";
          }
 }

  module.exports.Send = async(walletKey, privateKey, recieverAddress, amountToSend)=> 
  {  
    if (!bitcore.Address.isValid(recieverAddress))//, Networks.testnet))
    {
        return "Error address bitcoin.";
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
    const transaction = new bitcore.Transaction();

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
    //manually set transaction fees: 20 satoshis per byte
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

// Real bitcoin address
//  L3jf3aHCKAH47CxeCj9LAmdzveMWeenrSW3mT1CZMWTw1XJ3BoUn  - private key
//    1MMBtbsSqywLdopKzTJbZxb7QrYNvseNL2   - bitcoin address

//test
//  92nET8s4JwGWax7gayaFvy2sYEvJCVHSYVVDSKzYZMPhhteeb29
//  mwyu41zEx9uY3BqYvFzVRpGmVpKL6xDEHm


    //const privateKey = '93NoS1getiSerJ91otXk8MJcBL1L3T8j6ADPh7eqA63bdUHDQwJ';
    //const walletKey = 'miRbmzxiZQNRE4xEhuLXa2Ho3wdSDHPQqw';  

//  fee
//  0.00000145 BTC
// (0.642 sat/B - 0.251 sat/WU - 226 bytes)
// (1.000 sat/vByte - 145 virtual bytes)


//93NoS1getiSerJ91otXk8MJcBL1L3T8j6ADPh7eqA63bdUHDQwJ
//miRbmzxiZQNRE4xEhuLXa2Ho3wdSDHPQqw


//bitcoin
//KxZSgGSSLe8KfA8bGeGRAiokgAZFuknDonGgpCsdvpPdmUHUfJxA
//1Phgx6V5cUPyakMPj3RkE22pZNL5MNcsdu
