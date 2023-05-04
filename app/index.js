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
const koajwt = require('koa-jwt')
const statics = require("koa-static");
const fs = require('fs')
const mime = require('mime-types')
global.errs = errors
dotenv.config()

const app = new Koa()
const config = require('../config')
global.config = config
// app.use(statics(__dirname + "static"));
app.use(statics(__dirname + '/public'));
app.use(catchError)
// app.use(bodyParser())
app.use(koaBody({
    multipart: true,//支持文件上传
    encoding: 'gzip',
    formidable: {
        // uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true,
        maxFieldsSize: 2 * 1024 * 1024,
        // onFileBegin: (name, file) => {
        //     console.log('上传前')
        //
        // }
    }
}))
// app.use(async (ctx) => {
//     let filePath = path.join(__dirname, ctx.url)
//     let file = null
//     file = fs.readFileSync(filePath)
//     let mimeType = mime.lookup(filePath)
//     ctx.set('content-type', mimeType)
//     ctx.body =  file;
//
// })
// 注意：放在路由前面
app.use(koajwt({
    secret: 'Gopal_token'
}).unless({ // 配置白名单
    path: [/\/api\/register/, /\/api\/login/, /\/api\/readFile/]
}))
// logger  中间件
app.use(async (ctx, next) => {
    log4j.info(`get: ${JSON.stringify(ctx.request.query)}`)         // 监听get请求
    log4j.info(`params: ${JSON.stringify(ctx.request.body)}`)       // 监听post请求
    // log4j.error(`params: ${JSON.stringify(ctx.request.body)}`)       // 监听post请求
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
