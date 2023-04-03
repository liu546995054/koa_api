
// db/index.js
const Sequelize = require('sequelize')

const sequelize = new Sequelize(
    {
        host: process.env['DB_HOST'], // 数据库地址
        port: 3306,
        database: 'test',
        // 用户名
        username: 'root',
        // 密码
        password: 'root',
        dialect: 'mysql', // 数据库类型
        dialectOptions: { // 字符集
            charset:'utf8mb4',
            collate:'utf8mb4_unicode_ci',
            supportBigNumbers: true,
            bigNumberStrings: true
        },
        pool: {
            max: 5, // 连接池最大链接数量
            min: 0, // 最小连接数量
            idle: 10000 // 如果一个线程10秒内没有被使用的花，就释放连接池
        },
        timezone: '+08:00', // 东八时区
        logging: (log) => {
            console.log('dbLog: ', log)
            return false
        } // 执行过程会打印一些sql的log，设为false就不会显示
    }
)

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })



module.exports = sequelize