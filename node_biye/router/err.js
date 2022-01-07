//用来专门存放关于列表的所有接口
const Router = require('koa-router')
const err = new Router()

//写对应的接口
err.get('/', async(ctx) => {
    ctx.body = '访问的页面不纯在'
})


module.exports = err