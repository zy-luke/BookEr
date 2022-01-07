// 整个koa项目的入口文件
const Koa = require('koa2');

//静态资源
const path = require('path')
const static = require('koa-static')


//声明一个实例
const app = new Koa()
const port = 8888

//解决跨域
const cors = require('koa2-cors');
app.use(cors({
    // 允许 所有的都可以跨域
    origin: "*",
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 50000,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

//token导入
const koajwt = require('koa-jwt')
const token = require('./utils/token')


// app.use(koajwt({ secret: 'xy' }).unless({
//     path: [
//         /^\/user/ // 登陆接口 注册
//     ]
// }))

// 中间件对token进行验证
// app.use((ctx) => {
//     const Token = ctx.headers.authorization.split(" ")[1];
//     console.log(Token);
//     token.decrypt(Token)
// })

//上传文件
// app.use(koaBody({
//     // 支持文件格式
//     multipart: true,
//     formidable: {
//         // 上传目录
//         uploadDir: path.join(__dirname, 'public/uploads'),
//         // 保留文件扩展名
//         keepExtensions: true,
//     }
// }));

//引入路由
const router = require('./router')


// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './public'

app.use(static(
    path.join(__dirname, staticPath)
))


//const error
const errorHandler = require('./utils/errorHandler.js')

//router.routes()作用是启动路由
//router.allowedMethods()的作用是允许任何请求（get,post,put）
app.use(router.routes(), router.allowedMethods())
errorHandler(app)




app.listen(port, () => {
    console.log(`服务运行在 http://localhost:${port}`);
})