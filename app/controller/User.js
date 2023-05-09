const User = require('../model/User.js')
const resJson = require('../utils/resJson')
const jwt = require("jsonwebtoken");

const Sequelize = require('sequelize')


module.exports = {
    selectAll: async (ctx, next) => {
        await User.findAll({
            raw: true,
            attributes: { // 不返回password字段
                exclude: ['password']
            }
        }).then((res) => {
            // 成功返回
            ctx.body = resJson.success({data: res})
        }).catch((err) => {
            // 失败，捕获异常并输出
            ctx.body = resJson.fail(err)
        })
    },
    addUser: async (ctx, next) => {
        const params = ctx.request.body
        if (!params.name) {
            ctx.body = resJson.fail({msg: '请输入姓名'})
            return
        }
        await User.create(ctx.request.body).then((res) => {
            // 成功返回
            const token = jwt.sign({name: ctx.request.body.name}, "Gopal_token", {expiresIn: '4h'})
            res.dataValues.token = token
            ctx.body = resJson.success({data: res})
        }).catch((err) => {
            // 失败，捕获异常并输出
            ctx.body = resJson.fail(err)
        })

    },

    login: async (ctx, next) => {
        const params = ctx.request.body
        if (!params.name) {
            ctx.body = resJson.fail({msg: '请输入用户名'})
            return
        }
        if (!params.password) {
            ctx.body = resJson.fail({msg: '请输入密码'})
            return
        }
        await User.findOne({
            where: params,
            attributes:{ // 不返回password字段
            exclude: ['password']}}).then((res) => {
            if (res === null) {
                ctx.body = resJson.fail({msg: '用户名或密码错误'})
            } else {
                console.log(res instanceof User); // true
                console.log(res.name); // 'My Title'
                res.dataValues.token = jwt.sign({name: ctx.request.body.name}, "Gopal_token", {expiresIn: '4h'})
                ctx.body = resJson.success({data: res})
            }

        }).catch((err) => {
            // 失败，捕获异常并输出
            ctx.body = resJson.fail(err)
        })
    }
}
