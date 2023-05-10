const router = require('koa-router')({
    prefix: '/api'
})
// User控制器
const User = require('../controller/user')
const Upload = require('../controller/upload')
const mime = require("mime-types");
const resJson = require("../utils/resJson");
const upload = new Upload()
router.get('/users', User.selectAll);
router.post('/register', User.addUser);
router.post('/login', User.login);

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
router.get('/image', User.userImages);


module.exports = router;
