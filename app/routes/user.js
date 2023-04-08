const router = require('koa-router')({
    prefix: '/api'
})
// User控制器
const User = require('../controller/user')
const Upload = require('../controller/upload')
const upload = new Upload()
router.get('/users', User.selectAll);
router.post('/register', User.addUser);
// router.post('/upload',upload.uploadFile);

router.post('/upload', async(ctx) => {
    // console.log(ctx);
    // console.log(ctx.request.body);return
    ctx.body = await upload.uploadFile({ state: ctx.request.body, files: ctx.request.files });
});

//获取文件列表接口
router.get('/getFiles', async(ctx) => {
    // console.log(ctx);
    // console.log(ctx.request.body);return
    ctx.body = await upload.getFiles({ query: ctx.request.query });
});




module.exports = router;