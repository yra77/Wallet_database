
module.exports = function(app, main) 
{
     
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

    app.post('/send',(req, res) =>
    {
        var id = req.body.id;
        var toAddress = req.body.addressTo;
        var amount = req.body.amount;
    
       var resTransactions = main.SendCoin(id, toAddress, amount);
       resTransactions.then(val =>{res.send(val || {});});
    });

    app.post('/receive', (req, res) =>
    {
        var address = main.GetAddress(req.body.id);
        address.then(val =>{res.send(val || {});});
    });

    app.post('/start', (req, res) =>
    {
       var secretCode = main.secretCode;
       res.send(secretCode);
    });

     app.post('/balanceAll', (req, res) => 
     {
          var result = main.GetBalance();
           result.then(val =>{res.send(val);});
     });

     app.post('/price', (req, res) => 
     {
          var result = main.GetPrices();
           result.then(val =>{res.send(val);});
     });

     app.post('/history', (req, res) => 
     {
          var result = main.ReadHistory();
           result.then(val =>{res.send(val);});
     });
}