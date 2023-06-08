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
// const log4j = require('./utils/log4j')
const logsUtil = require('./utils/log4Util')
const koajwt = require('koa-jwt')
const statics = require("koa-static");
const fs = require('fs')
const mime = require('mime-types')
const {AuthFailed, NotFound} = require('./utils/http-exception')


dotenv.config()

const app = new Koa()
const config = require('../config')
global.config = config
global.errs = errors
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
// 错误处理
app.use((ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            throw new AuthFailed()
            // ctx.status = 401;
            // ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else if (err.status === 404) {
            throw new NotFound()
        } else {
            throw err;
        }
    })
})

// 注意：放在路由前面
app.use(koajwt({
    secret: 'Gopal_token'
}).unless({ // 配置白名单
    path: [/\/apis\/register/, /\/apis\/login/]
}))
// logger  中间件
app.use(async (ctx, next) => {
    const start = new Date();					          // 响应开始时间
    let intervals;								              // 响应间隔时间
    try {
        await next();
        intervals = new Date() - start;
        logsUtil.logResponse(ctx, intervals);	  //记录响应日志
    } catch (error) {
        intervals = new Date() - start;
        logsUtil.logError(ctx, error, intervals);//记录异常日志
    }

})


// app.on('error', (err, ctx) => {
//     log4j.error(err)
// })


const routing = require('./routes')
routing(app)
app.listen(3000)
