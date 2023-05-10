const User = require('../model/User.js')
const resJson = require('../utils/resJson')
const jwt = require("jsonwebtoken");

const sequelize = require('../db')
const Sequelize = require('sequelize')
// const FilesBaseModel = require("../model/upload");
// const upload = FilesBaseModel(sequelize, Sequelize).sync().then((res) => {
//     console.log(`FilesBaseModel 同步成功`, res);
// });
module.exports = {
    selectAll: async (ctx, next) => {
        await User.findAll({
            raw: true,
            attributes: { // 不返回password字段
                exclude: ['password']
            },
            include: [
                { model: ctx.model.Upload },
            ]
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
        // if (!params.phone) {
        //     ctx.body = resJson.fail({msg: '请输入手机号码'})
        //     return
        // }
        await User.create(ctx.request.body).then((res) => {
            // 成功返回
            // const token = jwt.sign({name: ctx.request.body.name}, "Gopal_token", {expiresIn: '4h'})
            // res.dataValues.token = token
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
            attributes: { // 不返回password字段
                exclude: ['password']
            }
        }).then((res) => {
            if (res === null) {
                ctx.body = resJson.fail({msg: '用户名或密码错误'})
            } else {
                console.log(res); // true
                // console.log(JSON.parse(res)); // 'My Title'
                res.dataValues.token = jwt.sign(res.dataValues, "Gopal_token", {expiresIn: '4h'})
                ctx.body = resJson.success({data: res})
            }

        }).catch((err) => {
            // 失败，捕获异常并输出
            ctx.body = resJson.fail(err)
        })
    },

    userImages: async (ctx, next) => {
        await sequelize.query("SELECT * FROM user WHERE id = 1").then(res=>{
            ctx.body = resJson.success({data: res})
        })
    }

}
