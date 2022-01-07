const db = require('../utils/db.js')
let sql = `SELECT * FROM bookinfo`
db.query(sql, (err, resluts) => {
    if (err) throw err;
    console.log(resluts);
})