const router = require('koa-router')({
    prefix: '/api'
})
// User控制器
const User = require('../controller/User')
const Upload = require('../controller/upload')
const mime = require("mime-types");
const resJson = require("../utils/resJson");
const upload = new Upload()
const user = new User()
router.get('/users', user.selectAll);
router.post('/register', user.addUser);
router.post('/login', user.login);

router.post('/upload', async (ctx) => {
    // console.log(ctx);
    // console.log(ctx.request.body);return
    const params = {
        userId: ctx.state.user.id,
        userName: ctx.state.user.name,
        ...ctx.request.body
    }
    ctx.body = await upload.uploadFile({state: params, files: ctx.request.files});
});

//获取文件列表接口
router.get('/getFiles', async (ctx) => {
    // console.log(ctx);
    // console.log(ctx.request.body);return
    ctx.body = await upload.getFiles({query: ctx.request.query});
});

router.post('/jwt', async (ctx) => {

    ctx.body = resJson.success({data: ctx.state.user})
});
router.get('/image', user.userImages);


module.exports = router;
