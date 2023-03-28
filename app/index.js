const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const koaBody = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const app = new Koa()
const routing = require('./routes')
const router = new Router()
const {connectionStr} = require('./config')
mongoose.connect(connectionStr, {useUnifiedTopology: true, useNewUrlParser: true}, () => {
    console.log('连接成功了')
})
mongoose.connection.on('error', console.error())
router.get('/', async function (ctx) {
    ctx.body = {message: 'Hello World'}
})
app.use(router.routes()).use(router.allowedMethods()).use(koaBody({
    multipart: true,//支持文件上传
    encoding: 'gzip',
    formidable: {
        uploadDir: path.join(__dirname, 'public/uploads'),
        keepExtensions: true,
        maxFieldsSize: 2 * 1024 * 1024,
        onFileBegin: (name, file) => {

        }
    }
})).use(error({
    postFormat: (e, {
        stack,
        ...rest
    }) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
})).use(parameter(app))

routing(app)
app.listen(3000)