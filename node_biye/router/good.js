//用来专门存放关于列表的所有接口
const Router = require('koa-router')
const good = new Router()
const path = require('path')
const koaBody = require('koa-body')

//导入数据库请求的方法
const db = require('../utils/db.js')

//用来获取请求的数据的
const bodyparser = require('koa-bodyparser')

// const { resolve } = require('path')
good.use(bodyparser())

//上传文件
good.use(koaBody({
    // 支持文件格式
    multipart: true,
    strict: false, //设为false 允许Delete请求
    formidable: {
        // 上传目录
        uploadDir: path.join(__dirname, '../public/uploads'),
        // 保留文件扩展名
        keepExtensions: true,
    }
}));

//商品上传接口
good.post('/putgoods', async(ctx) => {
    const postData = ctx.request.body
    const file = ctx.request.files.file
    ctx.type = 'Content-Type: application/json;charset=utf-8';
    // let sql = `SELECT * FROM bookinfo`
    postData.imgUrl = path.basename(file.path)
    console.log(postData);
    console.log(path.basename(file.path));
    let sql = `INSERT INTO bookinfo (bname,price,type,seller,imgUrl) VALUES('${postData.bname}','${postData.price}','${postData.type}','${postData.seller}','${postData.imgUrl}')`
    let data = await new Promise((reslove, reject) => {
        db.query(sql, function(err, results) {
            if (err) {
                throw err
            };
            results = {
                code: 200,
                message: '货物上传成功！',
                postData
            }
            console.log(results);
            reslove(results)
        })
    })
    ctx.body = data
})

//商品查询接口
good.get('/index', async(ctx) => {
    let sql = `SELECT * FROM bookinfo`
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

//商品删除接口
good.delete('/deletegoods', async(ctx) => {
    //接受字符串    {"id":"4"}
    const deleteData = JSON.parse(ctx.request.body)
    let sql = `DELETE FROM bookinfo WHERE id=${deleteData.id}`
    let data = await new Promise((reslove, reject) => {
        db.query(sql, function(err, results) {
            if (err) {
                throw err
            };
            results = {
                code: 200,
                message: '货物删除成功！',
            }
            reslove(results)
        })
    })
    ctx.body = data

})

//商品更新接口
good.put('/updategoods', async(ctx) => {
    const updateData = ctx.request.body
    const file = ctx.request.files.file
    updateData.imgUrl = path.basename(file.path)
    console.log(updateData);
    let sql = `UPDATE  bookinfo SET bname='${updateData.bname}',price=${updateData.price},type='${updateData.type}',seller='${updateData.seller}',imgUrl='${updateData.imgUrl}' WHERE id=${updateData.id}`
    let data = await new Promise((reslove, reject) => {
        db.query(sql, function(err, results) {
            if (err) {
                throw err
            };
            results = {
                code: 200,
                message: '货物更新成功！',
            }
            reslove(results)
        })
    })
    ctx.body = data
})
module.exports = good