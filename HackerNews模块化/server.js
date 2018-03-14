const http = require('http');

// 模块化文件的引入
// 端口配置
const config = require('./config');
//页面渲染架构
const context = require('./context');
//具体页面渲染
const router = require('./router');

http.createServer(function(req,res){
    //渲染
    context(res);
    //每一页的数据读取配置
    router(req,res);
    
}).listen(config.port,function(){
    console.log('开启了,请访问端口8080');
})