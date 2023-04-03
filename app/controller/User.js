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
        await User.create(ctx.request.body).then((res) => {
            // 成功返回
            ctx.body = resJson.success({data: res})
        })
            .catch((err) => {
            // 失败，捕获异常并输出
            console.log('PPPPP', err)
            console.log('oooooooooooo', err.errors)
            ctx.body = resJson.fail(err)
        })

    }
}
