const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const {koaBody} = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mysql = require('mysql')
const app = new Koa()
const routing = require('./routes')
const router = new Router()
// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "test",
// })
// connection.connect()
// let sql = "SELECT * FROM user"
// connection.query(sql, function (err, results,) {
//     if (err) throw err
//     console.log("results", results)
// })
// router.get('/', async function (ctx) {
//     ctx.body = {message: 'Hello World'}
// })
// app.use(router.routes()).use(router.allowedMethods()).use(koaBody({
//     multipart: true,//支持文件上传
//     encoding: 'gzip',
//     formidable: {
//         uploadDir: path.join(__dirname, 'public/uploads'),
//         keepExtensions: true,
//         maxFieldsSize: 2 * 1024 * 1024,
//         onFileBegin: (name, file) => {
//
//         }
//     }
// })).use(error({
//     postFormat: (e, {
//         stack,
//         ...rest
//     }) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
// })).use(parameter(app))

// routing(app)
const middleware = function (ctx, next) {
    console.log('111')
    next()
}
const middleware2 = function (ctx, next) {
    console.log('222')
    next()
    console.log('333')
}
const middleware3 = function (ctx, next) {
    console.log('444')
    next()
    console.log('555')
}
// app.use(middleware)
// app.use(middleware2)
// app.use(middleware3)
router.prefix('/api')
router.get('/', ctx => {
    ctx.body = 'Hello World,My first koa router'
})
router.get('/second', ctx => {
    ctx.body = 'Hello World,My second koa router'
})
app.use(router.routes()).use(router.allowedMethods)
    .use(koaBody({
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
app.listen(3000)