const path = require('path')
module.exports = {
    service: {
        port: process.env['SERVE_PORT'],
        enviroment: process.env['SERVE_ENVIROMENT'] || 'dev',
        staticPath: path.join(__dirname, `./app/public/uploads`), //静态文件路径,相对于 Server.js 的路径
    }

}