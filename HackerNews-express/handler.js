const path = require('path');

// 第三方模块
const mongodb = require('mongodb');

// 首页
module.exports.index = function(req,res){
     //查询所有数据
     //1.连接对象
     let mc = mongodb.MongoClient;
     //2.连接字符串
     let url = 'mongodb://127.0.0.1:27017';
     //3.连接
     mc.connect(url,function(err,client){
        if(err){
            throw err
        }
        //4.查询所有数据
        client.db('news').collection('one').find().toArray(function(err,docs){
            if(err){
                throw err
            }
            //5.关闭数据库
            client.close();

            //6.渲染
            res.render('index',{list:docs})
        })
     })
}
// 详情页 
module.exports.detail = function(req,res){
    
    let _id = mongodb.ObjectId(req.query.id)
    //连接数据库
    let mc = mongodb.MongoClient;
    let url = 'mongodb://127.0.0.1:27017';
    mc.connect(url,function(err,client){
        if(err){
            throw err
        }
        client.db('news').collection('one').findOne({_id:_id},function(err,doc){
            if(err){
                throw err
            }
            client.close();
            res.render('detail',{list:doc})
        })
    })
}
//提交页
module.exports.submit = function(req,res){
    res.render('submit')
}
//添加 add get
module.exports.addGet = function(req,res){
    //get 获得对象
    let obj = req.query
    let mc = mongodb.MongoClient;
    let url = 'mongodb://127.0.0.1:27017';
    mc.connect(url,function(err,client){
        if(err){
            throw err
        }
        client.db('new').collection('one').insertOne(obj,function(err){
            if(err){
                throw err
            }
            client.close();
            // 重定向
            res.redirect('/');
        })
   })
}
//添加 add post
module.exports.addPost = function(req,res){
    //post 获得对象
    let obj = req.body;
    
    let mc = mongodb.MongoClient;
    let url = 'mongodb://127.0.0.1:27017';
    mc.connect(url,function(err,client){
        if(err){
            throw err;
        }
        client.db('news').collection('one').insertOne(obj,function(err){
            if(err){
                throw err;
            }
            client.close();
            // 重定向
            res.redirect('/');
        })
   })
}



