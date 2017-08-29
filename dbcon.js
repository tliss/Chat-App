var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'xxx.xxx.xx.xx',
    user            : 'DB_USER_NAME',
    password        : 'DB_USER_PASSWORD',
    database        : 'DB_NAME'
});