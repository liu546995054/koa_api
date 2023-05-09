const router = require('koa-router')({
    prefix: '/api'
})
// User控制器
const User = require('../controller/user')
const Upload = require('../controller/upload')
const mime = require("mime-types");
const upload = new Upload()
router.get('/users', User.selectAll);
router.post('/register', User.addUser);
router.post('/login',User.login);

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

router.get('/readFile', async(ctx) => {
    // console.log(ctx.request.body);return
    let mimeType = mime.lookup(ctx.request.query.filePath)
    ctx.set('content-type', mimeType)
    ctx.body = await upload.readeFileContent({ filePath: ctx.request.query.filePath});
});




module.exports = router;
