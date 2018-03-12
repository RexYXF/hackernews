const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url');
// 第三方模块
const mime = require('mime') 

http.createServer(function(req,res){
    console.log(req.url);
    //首页
    if(req.url=='/'||req.url=='/index'){
        fs.readFile(path.join(__dirname,'./views/index.html'),function(err,data){
            if(err){
                throw err;
            }
            res.end(data);
        })
    }
    //详情页
    else if(req.url=='/detail'){
        fs.readFile(path.join(__dirname,'./views/detail.html'),function(err,data){
            if(err){
                throw err;
            }
            res.end(data);
        })
    }
    //提交页
    else if(req.url=='/submit'){
        fs.readFile(path.join(__dirname,'./views/submit.html'),function(err,data){
            if(err){
                throw err;
            }
            res.end(data);
        })
    }
    //添加 add get
    else if(req.url.startsWith('/add')&&req.method=='GET'){
        fs.readFile(path.join(__dirname,'./data/data.json'),'utf-8',function(err,data){
            //抛出错误,除了ENOENT这个错误
            if(err&&err.code !='ENOENT'){
                throw err;
            }
            // 将字符串转换成数组
            let arr=JSON.parse(data||'[]')

            let urlObj=URL.parse(req.url,true)
            let obj=urlObj.query;
            arr.push(obj);
            //数据写入回本地
            fs.writeFile(path.join(__dirname,'./data/data.json'),JSON.stringify(arr),function(err){
                if (err) {
                    throw err;
                }
                //重定向,设置状态码和状态信息
                res.statusCode='301';
                res.statusMessage='Moved Permanently';

                res.setHeader('Location','/');
                res.end(data);
            })
        })
    }
    //add post
    else if(req.url=='/add'&&req.method=='POST'){
            res.end('add post');
    }
    //静态资源
    else if(req.url.startsWith('/resources')){
        // 设置样式
        res.setHeader('content-type',mime.getType(req.url));
        // 读取数据
        fs.readFile(path.join(__dirname,req.url),function(err,data){
            if(err){
                throw err
            }
            // 返回给浏览器
            res.end(data)
        })
    }
    //其他
    else{
        res.end('404 no found page')
    }
}).listen(8080,function(){
    console.log('开启了,请访问端口8080');
})