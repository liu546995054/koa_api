/**
 * 文件服务类
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// const result = require(':lib/Result');
// const config = require(':config/server.base.config'); //配置文件
const {
    MODELS_PATH,
    SRC_PATH,
    getExtname,
    getTimeStampUUID,
    getYearMonthDay,
    getFileNameUUID32
} = require('../utils/util');
const {isDirExists, deleteFile, readerFile} = require('../utils/file');
const {BiuDB, SOP} = require('sequelize');
// const Email = require(':lib/Email');
const FilesBaseModel = require('../model/upload');
const resJson = require('../utils/resJson')
const Sequelize = require('sequelize')
const sequelize = require('../db')
module.exports = class {

    constructor() {
        FilesBaseModel(sequelize, Sequelize).sync().then((res) => {
            console.log(`FilesBaseModel 同步成功`, res);
        });
    }

    /**
     * 单文件上传
     * @param {*} param0
     */
    async uploadFile({state, files}) {
        const file = files.file; //文件
        if (!file) return resJson.fail({
            msg: `未发现上传文件!`
        });
        try {
            if (Array.isArray(file)) { //只能上传单文件,需要删除临时文件
                file.forEach((file) => {
                    deleteFile(file.path); //上传成功后删除临时文件
                });
                return resJson.fail(`只能上传单文件!`);
            } else if (file.size / 1024 / 1024 > 200) { //单位是M
                return resJson.fail(`上传文件不能超过200M!`);
            }
            //创建文件夹
            const time = getYearMonthDay(); //获取时间
            let uploadPath = path.join(config.service.staticPath, `/`, time.replace(/-/g, '')); //文件上传存放路径
            const existsSync = await isDirExists(uploadPath, true); //判断文件夹是否存在,不存在就创建
            if (existsSync) { //确认成功之后再进行操作
                const data = await this.__filePromise(file, uploadPath, state); //调用文件上传方法
                await FilesBaseModel(sequelize, Sequelize).create(data); //保存文件到数据库
                return resJson.success({data: data});
            }
            return resJson.fail(`上传文件异常!`);
        } catch (error) {
            console.log(error);
            return resJson.fail(error);
        }
    }

    /**
     * 多文件上传
     * @param {*} param0
     */
    async uploadFiles({state, files}) {
        if (!files.file) return resJson.fail(`未发现上传文件!`);
        //兼容单文件上传
        const fileList = Array.isArray(files.file) ? files.file : [files.file];
        try {
            const maxSize = fileList.map(item => item.size).reduce((a, b) => (a + b), 0);
            if (maxSize / 1024 / 1024 < 200) { //单位是M
                fileList.forEach((file) => {
                    deleteFile(file.path); //上传成功后删除临时文件
                });
                return resJson.fail(`批量上传文件总大小不能超过200M!`);
            }

            //创建文件夹
            const time = getYearMonthDay(); //获取时间
            let uploadPath = path.join(__dirname, `/public/uploads/`, time.replace(/-/g, '')); //文件上传存放路径
            const existsSync = await isDirExists(uploadPath, true); //判断文件夹是否存在,不存在就创建
            if (existsSync) { //确认成功之后再进行操作
                //多文件上传
                const saveFiles = await Promise.all(fileList.map((file) => {
                    return this.__filePromise(file, uploadPath, state.user.data);
                }));
                //保存文件到数据库
                await FilesBaseModel(sequelize, Sequelize).bulkCreate(saveFiles);
                console.log(saveFiles);
                // return result.success(null, saveFiles);
                return resJson.success({data: saveFiles});
            }
            return resJson.fail(`上传文件异常!`);
        } catch (error) {
            console.log(error);
            return resJson.fail(`上传文件出错!`);
        }
    }

    /**
     * 异步上传文件
     * @param {*} file
     * @param uploadPath
     * @param userId
     * @param userName
     * @param remark
     */
    __filePromise(file, uploadPath, {userId, userName,remark}) {
        return new Promise((resolve, reject) => { //异常上传,同步获取
            const md5sum = crypto.createHash('md5'); //创建文件指纹读取对象
            const {originalFilename, size, mimetype:type} = file;
            //创建数据库存储数据
            const data = {
                userId, //上传者id
                userName, //上传者名称
                fileId: Date.now(),
                size, //文件大小
                type, //文件类型
                fileName: originalFilename, //获取原文件名
                suffix: getExtname(originalFilename), //获取文件后缀名
                path: null, //文件路径
                aliasName: null, //文件别名
                remark //源文件路径
            };
            try {
                console.log(`正在上传${originalFilename}`);
                const reader = fs.createReadStream(file.filepath); //创建可读文件流
                const fileName = getFileNameUUID32(data.suffix); //重名名后的文件
                const fileSavePath = path.join(uploadPath, fileName); //合成路径 + 时间 + 文件名
                data.path = fileSavePath.split('public')[1]; //存储完整路径
                data.aliasName = fileName; //存储别名
                reader.pipe(fs.createWriteStream(fileSavePath)); //写入文件
                reader.on('data', (chunk) => {
                    md5sum.update(chunk);
                }); //读取文件流
                reader.on('end', () => {
                    data.fileMD5 = md5sum.digest('hex').toUpperCase();
                    console.log(`fileMD5:`, data.fileMD5);
                    reader.close(); //关闭文件
                    deleteFile(file.path); //上传成功后删除临时文件
                    console.log(`文件:${originalFilename} 上传成功!`);
                    resolve(data);
                });
                reader.on('error', (err) => {
                    reject(err);
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    /**
     * 批量删除文件
     * @param {*} param0
     */
    async deleteFiles({state, body: {ids}}) {
        if (!Array.isArray(ids)) return
        try {
            const {userId, isAdmin, roleName} = state.user.data;
            const queryData = {
                where: {
                    userId,
                    fileId: {[SOP.in]: ids},
                    isDelete: false
                }
            };
            if (isAdmin && (roleName === '超级管理员')) { //超级管理员会获取所有的文件
                delete queryData.where['userId'];
                delete queryData.where['isDelete'];
            }
            //查询相关文件
            const files = await FilesBaseModel(sequelize,Sequelize).findAll(queryData);
            if (files && files.length) { //获取数据库里的文件数据
                if (isAdmin && (roleName === '超级管理员')) { //只有超级管理员才能真正的删除文件,普通用户为软删除
                    const deleteFiles = files.map((file) => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                const res = await deleteFile(path.join(config.staticPath, file.path)); //上传成功后删除临时文件
                                if (res && res.code == 200) {
                                    await FilesBaseModel(sequelize,Sequelize).destroy({where: {fileId: file.fileId}});
                                    resolve(file);
                                } else {
                                    reject(res);
                                }
                            } catch (error) {
                                reject(error);
                            }
                        });
                    });
                    //返回删除文件的结果
                    const delData = await Promise.all(deleteFiles);
                    //批量删除数据库的数据
                    // return result.success(null, delData);
                    return resJson.success({data: delData});
                } else {
                    //批量软删除
                    await FilesBaseModel(sequelize,Sequelize).update({isDelete: true}, {where: {fileId: ids}});
                    // return result.success(null);
                    return resJson.success();
                }
            }
            // return result.success(`未发现需要删除的文件!`);
            return resJson.success({msg: `未发现需要删除的文件!`});
        } catch (error) {
            console.log(error);
            return resJson.fail({
                msg: `删除部分文件出错!`
            });
        }
    }

    /**
     * 获取文件列表
     * @param {*} param0
     */
    async getFiles({query}) {
        // const {userId, isAdmin, roleName} = state;
        const {keyword, isDelete, page, limit, userId} = query;
        let queryData = {
            where: {userId, isDelete: false},
            order: [
                ['createdTime', 'DESC']
            ]
            // attributes: { exclude: ['isDelete'] }
        };
        // if (isAdmin && (roleName === '超级管理员')) {
        //     delete queryData.where['userId']; //超级管理员会获取所有的文件
        //     delete queryData.where['isDelete'];
        // }
        if (keyword) {
            queryData.where['fileName'] = {
                [SOP.like]: `%${keyword}%`
            };
        }

        if (isDelete != undefined || isDelete != null) {
            console.log(isDelete);
            queryData.where['isDelete'] = isDelete != 0;
        }

        if (page && limit) { //分页
            queryData.offset = Number((page - 1) * limit); //开始的数据索引
            queryData.limit = Number(limit); //每页限制返回的数据条数
        }

        try {
            const {rows, count} = await FilesBaseModel(sequelize, Sequelize).findAndCountAll(queryData);
            const data = {
                list: rows, total: count
            }
            return resJson.success({data: data});
        } catch (error) {
            console.log(error);
            return resJson.fail(error);
        }
    }

    /**
     * 获取文件详情
     * @param {*} param0
     */
    async getFileById({fileId}) {
        if (!fileId) return
        try {
            const file = await FilesBaseModel(sequelize,Sequelize).findOne({
                where: {fileId, isDelete: false},
                attributes: ['fileId', 'path', 'fileName']
            });
            return resJson.success({data: file});
        } catch (error) {
            console.log(error);
            return resJson.fail(error);
        }
    }

    /**
     * 读取文件内容
     * @param {*} param0
     */
    async readeFileContent({filePath}) {
        // console.log('88888', filePath)
        // if (!filePath) return result.paramsLack();
        if (!filePath) return
        try {
            const {code, data} = await readerFile(path.join(__dirname, '../public', filePath), 'utf-8');
            if (code == 200) {
                return data
            }
            return resJson.fail({msg: '读取文件失败!'}); // return result.success(null, file);
        } catch (error) {
            console.log(error);
            return resJson.fail(error);
        }
    }
};
