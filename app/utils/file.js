const fs = require('fs');
// 图片文件夹路径
// const path = require('path');
// const request = require('request');
// const { SRC_PATH, getFileNameUUID32 } = require(':lib/Utils');

/**
 * 文件操作工具类
 */
const FileUtils = {

    /**
     * 读取目录
     * @param {*} path
     */
    async readdir(readPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(readPath, (err, files) => {
                if (err) {
                    console.log(`获取文件列表失败`);
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    },

    /**
     * 获取文件信息
     * @param {*} path
     */
    async getfileStat(filepath) {
        return new Promise((resolve, reject) => {
            fs.stat(filepath, (eror, stats) => {
                if (eror) {
                    console.log(`获取文件stats失败`);
                    reject(eror);
                } else {
                    if (stats.isFile()) { //是文件
                        resolve({ isFile: true, filepath, ...stats });
                    } else if (stats.isDirectory()) {
                        resolve({ isFile: false, filepath, ...stats });
                    } else {
                        reject(new Error(`未知类型!`));
                    }
                }
            });
        });
    },

    /**
     * 读取文件内容
     * @param {*} path
     * @param encode 编码格式
     * @returns { code,data}
     */
    async readerFile(fileFullPath, encode) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileFullPath, (err, data) => {
                if (err) {
                    console.log(`读取文件:${fileFullPath}内容失败,${err}`);
                    reject(err);
                } else if (encode) {
                    console.log(`读取文件:${fileFullPath}成功！`);
                    resolve({ code: 200, data: data.toString(encode || 'utf-8') });
                } else {
                    resolve({ code: 200, data });
                }
            });
        });
    },

    /**
     * 创建文件夹
     * @param {*} filepath
     * @returns Boolean
     */
    async createDir(filepath) {
        return new Promise((resolve, reject) => {
            fs.mkdir(filepath, (err) => {
                console.log('77777777777777',filepath)
                if (err) {
                    console.log(`创建文件夹:${filepath}失败！`);
                    reject(err);
                } else {
                    console.log(`创建文件夹:${filepath}成功！`);
                    resolve(true);
                }
            });
        });
    },

    /**
     * 判断一个文件夹是否存在
     * @param {*} dirpath 文件夹路径
     * @param {*} isCreateDir  如果不存在就创建
     */
    async isDirExists(dirpath, isCreateDir) {
        return new Promise(async (resolve, reject) => {
            if (!fs.existsSync(dirpath)) { //判断文件夹是否存在
                if (isCreateDir) {
                    const res = await FileUtils.createDir(dirpath);
                    if (res) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                } else {
                    resolve(false);
                }
            } else {
                resolve(true);
            }
        });
    },

    /**
     * 删除文件
     * @param {*} fileFullPath 文件的路径
     * @returns {code }
     */
    async deleteFile(fileFullPath) {
        return new Promise((resolve, reject) => {
            fs.unlink(fileFullPath, (err) => { //上传成功后删除临时文件
                if (err) {
                    console.log(`删除文件:${fileFullPath}异常!`);
                    reject(err);
                } else {
                    console.log(`删除文件:${fileFullPath}成功！`);
                    resolve({ code: 200, path: fileFullPath });
                }
            });
        });
    },

    /**
     * 写内容到文件
     * @param {*} path
     * @param encode 编码格式
     * @returns { code,data}
     */
    async writeFile(fileFullPath, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(fileFullPath, content, (err, data) => {
                if (err) {
                    console.log(`写入文件:${fileFullPath}内容失败,${err}`);
                    reject(err);
                } else if (content) {
                    console.log(`写入文件:${fileFullPath}成功！`);
                    resolve({ code: 200, data: data.toString(content || 'utf-8') });
                } else {
                    resolve({ code: 200, data });
                }
            });
        });
    }
};
module.exports = FileUtils;