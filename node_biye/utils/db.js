const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');

var pool = mysql.createPool({
    // connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'bookshop'
});

//   pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
//   });
function query(sql, callback) {
    pool.getConnection((err, connection) => {
        connection.query(sql, function(err, rows) {
            callback(err, rows)
            connection.release() //中断连接
        })

    })
}

module.exports.query = query