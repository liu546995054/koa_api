var path = require('path');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs')

/*报错输出日志*/
//错误日志目录、文件名、输出完整路径
var errorPath = "/error";
var errorFileName = "error";
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;

/*请求数据得到响应时输出响应日志*/
//响应日志目录、文件名、输出完整路径
var responsePath = "/response";
var responseFileName = "response";
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;

/*操作数据库进行增删改等敏感操作记录日志*/
//操作日志目录、文件名、输出完整路径
var handlePath = "/handle";
var handleFileName = "handle";
var handleLogPath = baseLogPath + handlePath + "/" + handleFileName;


module.exports = {
    //日志格式等设置
    appenders:
        {
            "rule-console": {"type": "console"},
            "errorLogger": {
                "type": "dateFile",//日志类型
                "filename": errorLogPath,//日志输出位置，当目录文件或文件夹不存在时自动创建
                "pattern": "-yyyy-MM-dd.log",
                "alwaysIncludePattern": true,
                "encoding": "utf-8",
                "maxLogSize": 104800,// 文件最大存储空间
                "numBackups": 100,//当文件内容超过文件存储空间时，备份文件的数量
                "path": errorPath
            },
            "resLogger": {
                "type": "dateFile",
                "filename": responseLogPath,
                "pattern": "-yyyy-MM-dd.log",
                "alwaysIncludePattern": true,
                "encoding": "utf-8",
                "maxLogSize": 104800,
                "numBackups": 100,
                "path": responsePath
            },
            "handleLogger": {
                "type": "dateFile",
                "filename": handleLogPath,
                "pattern": "-yyyy-MM-dd.log",
                "alwaysIncludePattern": true,
                "encoding": "utf-8",
                "maxLogSize": 104800,
                "numBackups": 100,
                "path": responsePath
            },
        },
    //供外部调用的名称和对应设置定义
    categories: {
        "default": {"appenders": ["rule-console"], "level": "all"},
        "resLogger": {"appenders": ["resLogger"], "level": "info"},
        "errorLogger": {"appenders": ["errorLogger"], "level": "error"},
        "handleLogger": {"appenders": ["handleLogger"], "level": "all"},
        "http": {"appenders": ["resLogger"], "level": "info"}
    },
    "baseLogPath": baseLogPath
}
