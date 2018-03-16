// 加载express模块
const express = require('express')
// 模板引擎模块
const ejs =  require('ejs');

// 模块化文件的引入
// 端口配置
const config = require('./config');
// 注册路由并页面渲染
const router = require('./router');

// 第三方模块
const bodyParser = require('body-parser')


//实例化express
let app = express();

// 静态样式
app.use('/resources',express.static('resources'))
//页面渲染
//使用模板引擎(ejs)
//1.告知express模板文件的目录
app.set('views','views');
//2.自定义模板引擎
app.engine('html',require('ejs').renderFile);
//3.告诉express我们使用什么模板引擎
app.set('view engine','html')

//获取请求主体(body-parser)
//urlencoded:监听data和end,把buffer全部拼接成一个完整的buffer-->查询字符串-->querystring-->对象
app.use(bodyParser.urlencoded({extended:false}))

//注册路由
app.use(router)

//开启服务器
app.listen(config.port,function(){
    console.log('服务器已开启');
})





