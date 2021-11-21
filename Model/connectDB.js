
var mysql = require('mysql');

module.exports.ConnectDB = async()=>
{
        var connection = mysql.createConnection
        ({
            host: 'localhost',
            user: 'root',
            password: '',
            insecureAuth: true,
            multipleStatements: true //несколько запросов одновременно.
        }); 
        
    connection.connect(function (err) 
    {
        if (err) 
        {
            console.log('mysql connect error: ' + err.stack);
            return '0';
        }      
    });
    console.log('mysql connected');// + connection.threadId);
    return connection;
}
