const express = require('express');
const handler = require('./handler');

// 实例化 Router
// router 是一个中间件和路由系统
let router = express.Router();

//注册路由
router.get('/',handler.index);
router.get('/index',handler.index);

router.get('/detail',handler.detail);

router.get('/submit',handler.submit);

router.get('/add',handler.addGet);

router.post('/add',handler.addPost);

// 导出去
module.exports = router;


