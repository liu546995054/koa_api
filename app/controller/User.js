const User = require('../model/User.js')
const resJson = require('../utils/resJson')
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
            ctx.body = resJson.fail({msg: '5566'})
            return
        }
        ctx.set("Content-Type", "application/json")
        ctx.request.body = JSON.stringify(ctx.request.body)
        await User.create(ctx.request.body).then((res) => {
            // 成功返回
            ctx.body = resJson.success({data: res})
        }).catch((err) => {
            // 失败，捕获异常并输出
            ctx.body = resJson.fail(err)
        })

    }
}
