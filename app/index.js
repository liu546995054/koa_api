const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const {koaBody} = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mysql = require('mysql')
const dotenv = require('dotenv')
const errors = require('./utils/http-exception')
// 全局异常中间件监听、处理，放在所有中间件的最前面
const catchError = require('./middleware/exception')
const bodyParser = require("koa-bodyparser");
const log4j = require('./utils/log4j')
global.errs = errors
dotenv.config()

const app = new Koa()
const config = require('../config')
global.config = config

app.use(catchError)
app.use(bodyParser())
app.use(koaBody({
    multipart: true,//支持文件上传
    encoding: 'gzip',
    formidable: {
        uploadDir: path.join(__dirname, 'public/uploads'),
        keepExtensions: true,
        maxFieldsSize: 2 * 1024 * 1024,
        onFileBegin: (name, file) => {

        }
    }
}))
// logger  中间件
app.use(async (ctx, next) => {

    // try {
    //     // 这里给ctx对象添加了一个error方法
    //     // 后面的代码中，当执行ctx.error方法时，就会抛出一个异常
    //     // 这样，在其他的路由或中间件里，代码执行到ctx.error时就会直接跳回到这个的错误捕捉中间件，ctx.error后面的代码就不会再执行了
    //     ctx.error = (code, message) => {
    //         if (typeof code === 'string') {
    //             message = code
    //             code = 500
    //         }
    //         ctx.throw(code || 500, message || '服务器错误')
    //     }
    //     await next()
    // } catch (e) {
    //     console.log('???????????')
    //     log4j.error(e)
    //     const status = e.status || 500
    //     ctx.error(status, e.message || '服务器错误')
    //
    //     // ctx.status = e.status || 500
    //     // ctx.body = e.message || '服务器错误'
    // }

    log4j.info(`get: ${JSON.stringify(ctx.request.query)}`)         // 监听get请求
    log4j.info(`params: ${JSON.stringify(ctx.request.body)}`)       // 监听post请求
    log4j.error(`params: ${JSON.stringify(ctx.request.body)}`)       // 监听post请求
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// app.on('error', (err, ctx) => {
//     log4j.error(err)
// })
const routing = require('./routes')
routing(app)
app.listen(3000)