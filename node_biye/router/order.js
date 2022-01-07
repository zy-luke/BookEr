//用来专门存放关于列表的所有接口
const Router = require('koa-router')
const order = new Router()


//导入数据库请求的方法
const db = require('../utils/db.js')

//用来获取请求的数据的
const bodyparser = require('koa-bodyparser')
order.use(bodyparser())


//写对应的订单接口
order.get('/list', async(ctx) => {
    const getData = ctx.request.query
    let sql = `SELECT * FROM  bookinfo ORDER BY id LIMIT ${getData.page*getData.size},${getData.size}`
    let data = await new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) {
                throw err
            }
            results = JSON.stringify(results)
            results = JSON.parse(results)
            results.map((v) => {
                v.imgUrl = `${ctx.origin}/uploads/${v.imgUrl}`
            })
            resolve(results)
        })
    })
    ctx.body = data
})



module.exports = order