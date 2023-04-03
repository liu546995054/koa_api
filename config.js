module.exports = {
    service: {
        port: process.env['SERVE_PORT'],
        enviroment: process.env['SERVE_ENVIROMENT'] || 'dev'
    }

}