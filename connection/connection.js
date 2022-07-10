
//create connection of mysql database
var mysql      = require('mysql'); //import the mysql module before using it

//details about connection to mysql server
var options = {
  host     : 'localhost',
  user     : 'user name',
  password : 'your password',
  database : 'your database name',
  multipleStatements : true
};

//creating a connection using inbuilt createconnection function
//we can also use pool connection method
var connection = mysql.createConnection(options);
 

//handle connection errors
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    console.log('connection failed')
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

// exporting so that we can use outside this file
module.exports = {connection, options};