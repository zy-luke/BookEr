//router的入口文件
//引入路由
const Router = require('koa-router')
const router = new Router()
const order = require('./order')
const user = require('./user')
const good = require('./good')

// const err = require('./err')

//路由重定向
// router.redirect('/', '/user/index')
router.use('/user', user.routes(), user.allowedMethods())
router.use('/good', good.routes(), good.allowedMethods())
router.use('/order', order.routes(), order.allowedMethods())
module.exports = router