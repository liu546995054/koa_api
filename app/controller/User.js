const User = require('../model/User.js')
const resJson = require('../utils/resJson')
const jwt = require("jsonwebtoken");

const sequelize = require('../db')
const Sequelize = require('sequelize')
const Upload = require('../model/upload')

// const user = User(sequelize, Sequelize)
module.exports = class {
    constructor() {
        User(sequelize, Sequelize).sync().then((res) => {
            console.log(`UserModel 同步成功`, res);
        });
    }

    async selectAll(ctx, next) {
//         console.log('++++++++',ctx.model)
//         let userModel = User(sequelize, Sequelize);
        let uploadModel = Upload(sequelize, Sequelize);
// //下面是重点，blogModel的type_id，指向typeModel的id
//         uoploadModel.belongsTo(userModel, {
//             foreginkey: "id",
//             targetkey: "userId",
//         })
        await User(sequelize, Sequelize).findAll({
            // raw: true,
            attributes: { // 不返回password字段
                exclude: ['password'],
            },
            include: [{model: uploadModel}]
        }).then((res) => {
            // 成功返回
            ctx.body = resJson.success({data: res})
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
            // 成功返回
            // const token = jwt.sign({name: ctx.request.body.name}, "Gopal_token", {expiresIn: '4h'})
            // res.dataValues.token = token
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
                console.log(res); // true
                // console.log(JSON.parse(res)); // 'My Title'
                res.dataValues.token = jwt.sign(res.dataValues, "Gopal_token", {expiresIn: '4h'})
                ctx.body = resJson.success({data: res})
            }

        }).catch((err) => {
            // 失败，捕获异常并输出
            ctx.body = resJson.fail(err)
        })
    }

    async userImages(ctx, next) {

        const [results, metadata] = await sequelize.query("SELECT user.id, FilesBases.fileId  FROM user AS user LEFT OUTER JOIN files_base AS FilesBases ON user.id = FilesBases.userId")
        // const [results, metadata] = await sequelize.query("SELECT * FROM user")
        console.log('PPPPPPP',metadata)
        ctx.body = resJson.success({data: results})
    }

}
