
module.exports.Write = (con, tableName, fieldName, val) =>
{ 
    return new Promise((resolve, reject) => 
    {   
        var sql = "INSERT INTO `" + tableName +"` (`" + fieldName + "`) VALUES (?)";
        
       con.query(sql, [ val], (err, result) => 
       {
        var res;
            if (err)
            {
                console.log(err);
                res = false;
                return reject(res);
            } 
            else
            {
                res = true;
                  return resolve(res);
            } 
       })
    });
}

module.exports.Read = (con, tableName, fieldName) =>
{
    return new Promise((resolve, reject) => 
    { 
       con.query("SELECT `" + fieldName + "` FROM `" + tableName + "`",(err, result) => 
       {
        if (err)
            {
                console.log(err);
                return reject(err);
            } 
            else
            {
                  return resolve(result);
            } 
       })
    });
  
}

module.exports.IsDB = (con)=>
{
    
    return new Promise((resolve, reject) => 
    { 
       con.query("SHOW DATABASES LIKE 'wallet'",(err, result) => 
       {
        var res;
        if (err)
            {
                console.log(err);
                res = false;
                return reject(res);
            } 
            else
            {
                if(result.length >= 1)
                    res = true;
                else
                    res = false;
                  return resolve(res);
            } 
       })
    });
  
}

module.exports.СreateDB = async(con)=>
{
    return new Promise((resolve, reject) => 
    { 
    var sql = "CREATE DATABASE wallet;";

       con.query(sql,(err, result) => 
       {
        var res;
        if (err)
            {
                console.log(err);
                res = false;
                return reject(res);
            } 
            else
            {
                res = true;
                  return resolve(res);
            } 
       })
    });
}

module.exports.CreateTable = (con, tableName, fieldName)=>
{
    con.changeUser({database : 'wallet'});
    return new Promise((resolve, reject) => 
    {  
      
    var sql = "CREATE TABLE ??(id INT PRIMARY KEY AUTO_INCREMENT, ?? VARCHAR(255) not null);";

       con.query(sql, [tableName, fieldName],(err, result) => 
       {
        var res;
            if (err)
            {
                console.log(err);
                res = false;
                return reject(res);
            } 
            else
            {
                res = true;
                  return resolve(res);
            } 
       })
    });
}
