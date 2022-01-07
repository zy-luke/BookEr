//用来专门存放关于user的所有接口

const Router = require('koa-router')
const user = new Router()

//导入数据库请求的方法
const db = require('../utils/db.js')

//用来获取请求的数据的
const bodyparser = require('koa-bodyparser')
user.use(bodyparser())

//创建token令牌
// const jwt = require('jsonwebtoken')
const token = require('../utils/token')

/**
 * 用户的接口
 */

//注册接口
user.post('/register', async(ctx, next) => {
    const postData = ctx.request.body
    ctx.type = 'Content-Type: application/json;charset=utf-8';
    let sql1 = `SELECT * FROM student WHERE usernum='${postData.usernum}'`
    let sql2 = `INSERT INTO student (usernum,PASSWORD,NAME) VALUES('${postData.usernum}',${postData.password},'${postData.name}')`

    let data1 = await new Promise((reslove, reject) => {
        db.query(sql1, function(err, resluts) {
            if (err) {
                console.log(err);
                throw err
            };
            reslove(resluts)
        })
    })
    console.log(data1, Boolean(!data1.length));
    if (!data1.length) {
        let data2 = await new Promise((reslove, reject) => {
            db.query(sql2, function(err, results) {
                if (err) {
                    reject('注册失败，参数不正确！')
                    throw err
                };
                results = {
                    message: '注册成功',
                    data: postData,
                    code: 200
                }
                reslove(results)
            });
        })
        ctx.body = data2
    } else {
        ctx.body = {
            message: '已经有了注册账户',
            code: 200
        }
    }

})

//登录接口
user.post('/login', async(ctx, next) => {
    const postData = ctx.request.body
    ctx.type = 'Content-Type: application/json;charset=utf-8';
    let sql = `SELECT * FROM student WHERE usernum='${postData.usernum}'`
    let data = await new Promise((reslove, reject) => {
        db.query(sql, function(err, results) {
            if (err) {
                reject('登录失败')
                throw err
            };
            if (results.length != 0 && results[0].password == `${postData.password}`) {
                //创建一个token
                // const token = jwt.sign({ usernum: postData.usernum, password: postData.password }, 'secret', { expiresIn: 3600 })
                const Token = token.encrypt({ data: postData.usernum })
                let info = {
                    password: postData.password,
                    name: postData.usernum,
                }
                let data = {
                    Bearer: 'Bearer',
                    token: token.encrypt(info)
                }
                reslove(data)
            } else {
                const message = results.length == 0 ? '用户没有注册!' : '密码错误！'
                results = {
                    code: 401,
                    message
                }
                reslove(results)
            }
        })
    })
    ctx.body = data
})

//用户列表接口
user.get('/getstudents', async(ctx) => {
    let sql = `SELECT * FROM student`
    let result = await new Promise((reslove, reject) => {
        db.query(sql, (err, resluts) => {
            if (err) {
                throw err
            } else {
                reslove(resluts)
                console.log(resluts);
            }
        })
    })
    ctx.body = result
})

//查询用户
user.get('/findstudents', async(ctx) => {
        const getData = ctx.request.query
        console.log(getData);
        let sql = `SELECT * FROM student where id=${getData.id}`
        let data = await new Promise((reslove, reject) => {
            db.query(sql, (err, resluts) => {
                if (err) {
                    throw err
                } else {
                    reslove(resluts)
                    console.log(resluts);
                }
            })
        })
        ctx.body = data
    })
    //导出user路由
module.exports = user