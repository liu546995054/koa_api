const router = require('koa-router')({
    prefix: '/api'
})
// User控制器
const User = require('../controller/user')
router.get('/users',User.selectAll);
router.post('/users/add',User.addUser);

module.exports = router;