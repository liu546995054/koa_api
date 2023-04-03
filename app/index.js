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
const routing = require('./routes')
routing(app)
app.listen(3000)