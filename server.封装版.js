const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url');
const querystring = require('querystring')
// 第三方模块
const mime = require('mime');
const _ = require('underscore');

http.createServer(function(req,res){
    //渲染数据封装
    res.render=function(filepath,tplData){
        fs.readFile(filepath,function(err,data){
            if(err){
                throw err;
            }
            //如果传了模板数据  tplData是根据需要传入数组或者对象 list.length 
            if(tplData){
                //underscore的template需要传入字符串
                let tplStr = data.toString();
                // var compiled = _.template("hello: <%= name %>");
                // compiled({name: 'moe'});
                // => "hello: moe"
                let tplFn = _.template(tplStr);
                let newStr = tplFn({list:tplData})
                //输出到前台;
                res.end(newStr)
            }else{
                //否则没有传值直接渲染静态页面
                res.end(data);
            }
        })
    }
    //首页
    if(req.url=='/'||req.url=='/index'){
        // 拿到本地数据渲染
        readData(function(data){
            let arr =JSON.parse(data||'[]');
            //模板需要传入数组
            res.render(path.join(__dirname,'./views/index.html'),arr)
        })
    }
    //详情页
    else if(req.url=='/detail'){
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
    else if(req.url=='/submit'){
        res.render(path.join(__dirname,'./views/submit.html'))
    }
    //添加 add get
    else if(req.url.startsWith('/add')&&req.method=='GET'){
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
    else if(req.url=='/add'&&req.method=='POST'){
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
    else if(req.url.startsWith('/resources')){
        // 设置样式
        res.setHeader('content-type',mime.getType(req.url));
        // 读取数据
        res.render(path.join(__dirname,req.url))
    }
    //其他
    else{
        res.end('404 no found page')
    }
}).listen(8080,function(){
    console.log('开启了,请访问端口8080');
})

//渲染数据封装
res.render=function(filepath){
    fs.readFile(filepath,function(err,data){
        if(err){
            throw err;
        }
        res.end(data);
    })
}

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
        buffArr.pash(chunk)
    })
    req.on('end',function(){
        let buffer = Buffer.concat(buffArr);
        let str = buffer.toString();
        let obj = querystring.parse(str);
        callback(obj)
    })
}