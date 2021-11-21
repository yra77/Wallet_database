const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const contractABI = require('../ABI/erc20_ABI').abi;

class Erc20 
{
    constructor(contractaddress) 
    {
        this.contractAddress = contractaddress;
        this.web3 = new Web3('https://mainnet.infura.io/v3/dc0b759838f44e9fa4c4ae26d541d6e8');//mainnet
       this.contract = new this.web3.eth.Contract(contractABI, this.contractAddress);
    }

    GetBalance = async(address)=>
    {
          const balance = await this.contract.methods.balanceOf(address).call(); 
       return balance;
    }
    
    AmountFee = async()=>
    {      
         return this.web3.utils.fromWei((await this.web3.eth.getGasPrice()*21000).toString(), 'ether');     
    }
    
    Send = async(etherAddress, privateKey, toAddress, amount)=>
    {
     
        if(amount < 1)
            return "The amount must be greater than 1.";
       if(!this.web3.utils.isAddress(toAddress))
                return "Error address tether erc20.";
       
        var gasprice = await this.web3.eth.getGasPrice();
        const count = await this.web3.eth.getTransactionCount(etherAddress);
        amount = this.web3.utils.toHex(amount);
    
        //this.AmountFee().then(gasPrice =>{console.log("This fee = " + gasPrice + " eth.");});
    
        var rawTransaction = 
        { 
            "from": etherAddress, 
            "gasPrice": this.web3.utils.toHex(gasprice), 
            "gasLimit": this.web3.utils.toHex(100000), 
            "to": this.contractAddress, 
            "value": "0x0", 
            "data": this.contract.methods.transfer(toAddress, amount).encodeABI(), 
            "nonce": this.web3.utils.toHex(count) 
        };
    
        var transaction = new Tx(rawTransaction, {chain:'mainnet'});
        var privKeyBuffer = new Buffer.from(privateKey.substring(2,66), 'hex');
        transaction.sign(privKeyBuffer);
    
        const result = await this.web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
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
           return 'insufficient funds for gas * price + value.';
        }
        
    }

};

module.exports = Erc20;