const Sequelize = require('sequelize')
const sequelize = require('../db')
const validator = require('validator')
const Upload = require("../model/upload");

module.exports = (sequelize,Sequelize) => {
    const User = sequelize.define('user', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false, // 设置为false时，会给添加NOT NULL（非空）约束，数据保存时会进行非空验证
                comment: 'ID', // 字段描述（自1.7+后，此描述不再添加到数据库中
                autoIncrement: true, // 是否自增
                primaryKey: true, // 指定是否是主键
                unique: true, // 设置为true时，会为列添加唯一约束
            },
            password: {
                type: Sequelize.STRING(20),
                validate: {
                    isEmpty(value) {
                        if (!value) {
                            throw new Error('请输入密码');
                        }
                    }
                }, // 模型每次保存时调用的验证对象。可是validator.js中的验证函数(参见 DAOValidator)、或自定义的验证函数
                allowNull: false, // 设置为false时，会给添加NOT NULL（非空）约束，数据保存时会进行非空验证
                comment: '密码' // 字段描述（自1.7+后，此描述不再添加到数据库中）
            },
            name: {
                type: Sequelize.STRING(20),
                validate: {
                    isEmpty(value) {
                        if (!value) {
                            throw new Error('请输入用户名称');
                        }
                    }
                }, // 模型每次保存时调用的验证对象。可是validator.js中的验证函数(参见 DAOValidator)、或自定义的验证函数
                allowNull: false, // 设置为false时，会给添加NOT NULL（非空）约束，数据保存时会进行非空验证
                comment: '用户名称' // 字段描述（自1.7+后，此描述不再添加到数据库中）
            },
            email: {
                type: Sequelize.STRING(20),
                validate: {
                    // isEmail: true,
                    // 自定义验证器的示例:
                    isEmpty(value) {
                        if (!value) {
                            throw new Error('请输入邮箱地址');
                        }
                    },
                    isEmail(value) {
                        if (!validator.isEmail(value)) {
                            throw new Error('请输入正确的邮箱地址');
                        }
                    }

                }, // 模型每次保存时调用的验证对象。可是validator.js中的验证函数(参见 DAOValidator)、或自定义的验证函数
                allowNull: false, // 设置为false时，会给添加NOT NULL（非空）约束，数据保存时会进行非空验证
                comment: 'email' // 字段描述（自1.7+后，此描述不再添加到数据库中）
            },
            phone: {
                type: Sequelize.STRING(11),
                allowNull: false, // 设置为false时，会给添加NOT NULL（非空）约束，数据保存时会进行非空验证
                comment: '手机号码' // 字段描述（自1.7+后，此描述不再添加到数据库中）
            },
            birth: {
                type: Sequelize.DATE,
                // allowNull: false, // 设置为false时，会给添加NOT NULL（非空）约束，数据保存时会进行非空验证
                defaultValue: new Date(), // 字面默认值, JavaScript函数, 或一个 SQL 函数
                comment: '生日' // 字段描述（自1.7+后，此描述不再添加到数据库中）
            },
            sex: {
                type: Sequelize.INTEGER,
                validate: {
                    // isInt: true,
                    // len: 1,
                    isInt(value) {
                        if (value && !validator.isInt(value)) {
                            throw new Error('男女不对');
                        }
                    }
                }, // 模型每次保存时调用的验证对象。可是validator.js中的验证函数(参见 DAOValidator)、或自定义的验证函数
                allowNull: false, // 设置为false时，会给添加NOT NULL（非空）约束，数据保存时会进行非空验证
                defaultValue: 0, // 字面默认值, JavaScript函数, 或一个 SQL 函数
                comment: '性别，0-男 1-女' // 字段描述（自1.7+后，此描述不再添加到数据库中）
            },

        },
        {
            freezeTableName: true, // 设置为true时，sequelize不会改变表名，否则可能会按其规则有所调整
            timestamps: true, // 为模型添加 createdAt 和 updatedAt 两个时间戳字段
        },

    )
    User.hasMany(Upload(sequelize,Sequelize),{
        foreignKey:'userId'
    })
    return User
}




