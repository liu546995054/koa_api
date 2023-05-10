/**
 * 文件基础表数据模型
 * @param {*} sequelize
 * @param {*} dataTypes
 * 此模型仅限关系型数据库使用
 */
// const { getTimeStampUUID } = require(':lib/Utils');
/**
 * @param app
 */
const Sequelize = require('sequelize')
const sequelize = require('../db')
const User = require('../model/User.js')
module.exports = app => {
    // const sequelize = app.sequelize
    // const dataTypes = app.dataTypes
   const Upload =  sequelize.define('FilesBase', {

        //文件ID
        fileId: {
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true
        },

        //文件名
        fileName: {
            type: Sequelize.STRING(100),
            allowNull: true
        },

        //文件别名
        aliasName: {
            type: Sequelize.STRING(100),
            allowNull: true
        },

        //上传人ID
        userId: {
            type: Sequelize.STRING(50),
            allowNull: true
        },

        //上传人名称
        userName: {
            type: Sequelize.STRING(100),
            allowNull: true
        },

        //文件大小
        size: {
            type: Sequelize.INTEGER(20),
            allowNull: true
        },

        //文件类型
        type: {
            type: Sequelize.STRING(100),
            allowNull: true
        },

        //文件后缀
        suffix: {
            type: Sequelize.STRING(30),
            allowNull: true
        },

        //文件存放的路径
        path: {
            type: Sequelize.STRING(200),
            allowNull: true
        },

        //文件状态
        status: {
            type: Sequelize.INTEGER(2),
            allowNull: true
        },

        //备注
        remark: {
            type: Sequelize.STRING(255),
            allowNull: true
        },

        //是否删除 true是 false否
        isDelete: {
            type: Sequelize.BOOLEAN(),
            allowNull: true,
            defaultValue: () => false
        },

        //创建时间
        createdTime: {
            type: Sequelize.INTEGER(),
            allowNull: true,
            defaultValue: () => (Date.parse(new Date()) / 1000)
        },

        //修改时间
        updatedTime: {
            type: Sequelize.INTEGER(),
            allowNull: true,
            defaultValue: () => (Date.parse(new Date()) / 1000)
        }
    }, {
        tableName: 'files_base'
    });

    User.hasMany(Upload, {
        foreignKey: 'userId',
        // otherKey: 'users_id',
    });
    Upload.belongsTo(User);

    return Upload
};
