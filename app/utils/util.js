const Utils = {
    renderFormData(params) {
        const data = new FormData()
        for (let [key, value] of Object.entries(params)) {
            data.append(key, value)
        }
        return data
    },

    /**
     * 获取文件的后缀名
     * @param {*} filename
     */
    getExtname(filename) {
        if (!filename || typeof filename != 'string') return false;
        const a = filename.split('').reverse().join('');
        const b = a.substring(0, a.search(/\./)).split('').reverse().join('');
        return b;
    },

    /**
     * 获取年月日 2019-09-25
     * @param {*} connect 连接符
     */
    getYearMonthDay(connect) {
        const str = connect || '-';
        const date = new Date();
        const Y = date.getFullYear();
        const M = date.getMonth() + 1;
        const D = date.getDate();
        return `${Y}${str}${M > 10 ? M : '0' + M}${str}${D > 10 ? D : '0' + D}`;
    },

    /**
     * 生成文件名
     * @param {*} isLowerCase
     */
    getFileNameUUID32(nameExtension, isLowerCase) {
        const str = Date.now();
        // const name = isLowerCase ? str : str.toUpperCase();
        return `BIUXS_WEB_${str}.${nameExtension}`;
    }
}


module.exports = Utils;


