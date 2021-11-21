
const web3 =  require("@solana/web3.js");

  const connection = new web3.Connection(web3.clusterApiUrl('devnet'),'confirmed', );//('devnet');
  // Uncomment the below command to test your connection to your node
  //console.log(await connection.getEpochInfo())
// console.log(web3.clusterApiUrl('devnet'))
  
   module.exports.GetBalance = async(publicKey) =>
   {
    const toAddress = new web3.PublicKey(publicKey);
    var res = '';
      await connection.getBalance(toAddress).then(resolution => 
      {
          //console.log(resolution.toString());
          res = resolution;
      });
      return res;
   }

   module.exports.CreateKeys = async (str) =>
   {
    var arr = str.split('');
    var a = [...arr].map(s => s.charCodeAt()); 
    var secretSTR = new Uint8Array(a.slice(0,32));// to 32byte
    var keypair = web3.Keypair.fromSeed(secretSTR);//web3.Keypair.fromSecretKey(secretSTR);//

    if(keypair)
    {
      return { "solana": { "privateKey": keypair.secretKey.toString(), "address": keypair.publicKey.toString() } };
    }
    else 
    {
      console.log("Error string solana.");
      return "0";
    }
   }
 
   module.exports.Send = async(walletKey, privateKey1, toAddress1, amount)=>
   {
    var toAddress = '';
    var privateKey =  new Uint8Array(privateKey1.split(','));
    try
    {
        toAddress = new web3.PublicKey(toAddress1);
    }
    catch(e)
       {
         return "Error solana address."
       };
    var from = web3.Keypair.fromSecretKey(privateKey);

      // There are 1-billion lamports in one SOL // LAMPORTS_PER_SOL = 1000000000;
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer
        ({
          fromPubkey: from.publicKey,
          toPubkey: toAddress,
          lamports: amount*1000000000//web3.LAMPORTS_PER_SOL / 100,
        }),
      );
    
      // Sign transaction, broadcast, and confirm
      var signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [from],
      ).catch(e =>
        {
          return e
        });
     
        return signature || "Error transation.";
   }
  
  // const fromAddress = "9bDiNk1VCrYGgrS22WBG9yd4RG5DA2CncGHDDnZ5VBz";
  // const FROM_SECRET_KEY =  new Uint8Array([
  //                                           64,116,167,111,196,119,102,134,61,88,54,0,51,88,47,19,93,101,188,177,46
  //                                          ,91,218,245,90,170,47,229,26,91,71,45,2,51,86,150,241,90,137,55,201,72,204
  //                                          ,28,237,103,182,95,236,230,54,74,15,89,115,66,186,10,16,105,118,31,109,45
  //                                         ]);

 // const toAddress = "DKR1dcVynm47Fi6zQdP3KevJ6vGYqDRAr9hHenVTriWT";
 //   42,133,104,197,3,0,225,39,137,122,108,213,42,8,41,53,95,25,162,106,129,20,66,6,157,219,
 //   84,79,38,74,200,120,183,3,216,204,156,16,243,115,29,118,152,35,157,62,16,234,107,152,17,
 //   178,229,16,65,147,23,178,47,59,230,188,73,248

 // var from = web3.Keypair.fromSecretKey(FROM_SECRET_KEY);//1989995000
 // const toAddress = new web3.PublicKey('DKR1dcVynm47Fi6zQdP3KevJ6vGYqDRAr9hHenVTriWT');// 510000000
// this.SendSolana(from, toAddress, 0.5);
//this.GetBalance(from.publicKey);//toAddress);

//for solana
// const FROM_SECRET_KEY =  new Uint8Array([
//   64,116,167,111,196,119,102,134,61,88,54,0,51,88,47,19,93,101,188,177,46
//  ,91,218,245,90,170,47,229,26,91,71,45,2,51,86,150,241,90,137,55,201,72,204
//  ,28,237,103,182,95,236,230,54,74,15,89,115,66,186,10,16,105,118,31,109,45
// ]);
// var from = web3.Keypair.fromSecretKey(FROM_SECRET_KEY);//1989995000
// const toAddress = new web3.PublicKey('DKR1dcVynm47Fi6zQdP3KevJ6vGYqDRAr9hHenVTriWT');// 510000000

 //solanaWallet.SendSolana(from, toAddress, 0.5);