const fs = require('fs');
const path = require('path');
const URL = require('url');
const querystring = require('querystring')
// 第三方模块
const mime = require('mime');
//文件模块
const config = require('./config');

// 首页
module.exports.index = function(res){
     // 拿到本地数据渲染
     readData(function(data){
        let arr =JSON.parse(data||'[]');
        //模板需要传入数组
        res.render(path.join(__dirname,'./views/index.html'),arr)
    })
}
// 详情页 
module.exports.detail = function(req,res){
    //获得id
    let id = URL.parse(req.url,true).query.id;
    readData(function(data){
        let arr =JSON.parse(data||'[]');
        for(let i=0;i<arr.length;i++){
            const obj = arr[i]
            if(obj.id==id){
                //模板需要传入对象
                res.render(path.join(__dirname,'./views/detail.html'),obj)
            }
        }
    })
}
//提交页
module.exports.submit = function(res){
    res.render(path.join(__dirname,'./views/submit.html'))
}
//添加 add get
module.exports.addGet = function(req,res){
    readData(function(data){
        // 将字符串转换成数组
        let arr=JSON.parse(data||'[]')

        let urlObj=URL.parse(req.url,true)
        let obj=urlObj.query;
        //添加id属性
        obj.id=arr.length;
        arr.push(obj);
        //数据写入回本地
        writeData(arr,function(){
            //重定向,设置状态码和状态信息
            res.statusCode='301';
            res.statusMessage='Moved Permanently';

            res.setHeader('Location','/');
            res.end(data);
        })
    })
}
//添加 add post
module.exports.addPost = function(req,res){
    readData(function(data){
        //转换为数组
        let arr = JSON.parse(data||'[]');
        //获得前端填的post传来的数据(在请求头里)
        //监听data end 事件
        postBody(req,function(obj){
            //添加id属性
            obj.id = arr.length;
            //最后加到原来的数据里
            arr.push(obj);
            //再写入本地data.json里
            fs.writeFile(path.join(__dirname,'./data/data.json'),JSON.stringify(arr),function(err){
                if(err){
                    throw err;
                }
                //重定向
                res.statusCode='301';
                res.statusMessage='Moved Permanently';
                res.setHeader('Location','/');
                res.end()
            })
        })

    })
}
//静态资源
module.exports.static = function(req,res){
    // 设置样式
    res.setHeader('content-type',mime.getType(req.url));
    // 读取数据
    res.render(path.join(__dirname,req.url))
}


/**********************公共方法********************/

//读取数据封装
function readData(callback){
    //拿到本地数据
    fs.readFile(path.join(__dirname,'data/data.json'),'utf-8',function(err,data){
        if(err && err.code!='ENOENT'){
            throw err
        }
        callback(data);
    })
}

//写入数据
function writeData(list,callback){
    fs.writeFile(path.join(__dirname,'data/data.json'),JSON.stringify(list),function(err){
        if(err){
            throw err;
        }
        callback()
    })
}

//请求体获取数据
function postBody(req,callback){
    let buffArr=[];
    req.on('data',function(chunk){
        buffArr.push(chunk)
    })
    req.on('end',function(){
        let buffer = Buffer.concat(buffArr);
        let str = buffer.toString();
        let obj = querystring.parse(str);
        callback(obj)
    })
}