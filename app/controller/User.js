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

    }
}
