const User = require('../model/User.js')
const resJson = require('../utils/resJson')
const jwt = require("jsonwebtoken");

const sequelize = require('../db')
const Sequelize = require('sequelize')
const Upload = require('../model/upload')
const Op = Sequelize.Op

// const user = User(sequelize, Sequelize)
module.exports = class {
    constructor() {
        User(sequelize, Sequelize).sync().then((res) => {
            console.log(`UserModel 同步成功`, res);
        });
    }

    async selectAll(ctx, next) {
        let {keywords, phone, pageIndex, pageSize} = {...ctx.query}
        let uploadModel = Upload(sequelize, Sequelize);
        let whereObj = {}
        keywords && Object.assign(whereObj, {
                // [Op.like]: `%${name}%`
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${keywords}%`
                        }
                    },
                    {
                        phone: {
                            [Op.like]: `%${keywords}%`
                        }
                    }
                ]

        })
        // phone && Object.assign(whereObj, {phone})
        //查数量
        let count = await User(sequelize, Sequelize).count({where: whereObj})
        pageIndex = JSON.parse(pageIndex)
        pageSize = JSON.parse(pageSize)
        const _pageInfo = {
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize
        }
        await User(sequelize, Sequelize).findAll({
            // raw: true,
            attributes: { // 不返回password字段
                exclude: ['password'],
            },
            where: whereObj,
            include: [{model: uploadModel}],
            ..._pageInfo
        }).then((res) => {
            // 成功返回
            ctx.body = resJson.success({data: {list: res, count: count}})
        }).catch((err) => {
            // 失败，捕获异常并输出
            ctx.body = resJson.fail(err)
        })

    }

    async addUser(ctx, next) {
        const params = ctx.request.body
        if (!params.name) {
            ctx.body = resJson.fail({msg: '请输入姓名'})
            return
        }
        // if (!params.phone) {
        //     ctx.body = resJson.fail({msg: '请输入手机号码'})
        //     return
        // }
        await User(sequelize, Sequelize).create(ctx.request.body).then((res) => {
            ctx.body = resJson.success({data: res})
        }).catch((err) => {
            // 失败，捕获异常并输出
            ctx.body = resJson.fail(err)
        })

    }

    async login(ctx, next) {
        const params = ctx.request.body
        if (!params.name) {
            ctx.body = resJson.fail({msg: '请输入用户名'})
            return
        }
        if (!params.password) {
            ctx.body = resJson.fail({msg: '请输入密码'})
            return
        }
        await User(sequelize, Sequelize).findOne({
            where: params, attributes: { // 不返回password字段
                exclude: ['password']
            }
        }).then((res) => {
            if (res === null) {
                ctx.body = resJson.fail({msg: '用户名或密码错误'})
            } else {
                res.dataValues.token = jwt.sign(res.dataValues, "Gopal_token", {expiresIn: '4h'})
                ctx.body = resJson.success({data: res})
            }

        }).catch((err) => {
            // 失败，捕获异常并输出
            ctx.body = resJson.fail(err)
        })
    }

    async userImages(ctx, next) {
        const sql = 'SELECT * FROM user LIMIT 0,10'
        const [results, metadata] = await sequelize.query(sql)
        await Promise.all(results.map(function (elem) {
            return new Promise(async (resolve, reject) => {
                /* 关联查询 */
                const sql = `SELECT * FROM files_base WHERE files_base.userId = '${elem.id}'`
                const [res, metadata] = await sequelize.query(sql)
                elem.ROLE = [...res]
                resolve(res);
            })
        }))
        ctx.body = resJson.success({data: results})
    }

}
