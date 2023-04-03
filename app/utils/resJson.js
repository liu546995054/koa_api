// utils/resJson.js

const ResultJson =  {
    success: (params) => {
        return {
            data: params.data || null, // 返回的数据
            msg: params.msg || '操作成功', // 返回的提示信息
            code: 200 // 返回的接口调用状态码，100-失败，200-成功
        }
    },
    fail: (params) => {
        console.log('////////////////',params.errors)
        return {
            data: params.data || null,
            msg: params.msg ||params.errors[0].message || '操作失败',
            code: 100,
            error_code: params.errorCode // 返回接口异常信息码
        }
    }
}

module.exports = ResultJson