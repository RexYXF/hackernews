const path = require('path');

// 封装模块文件
const db = require('./db');

// 首页
module.exports.index = function(req,res){
     //查询所有数据
    db.find_All(function(docs){
        //6.渲染
        res.render('index',{list:docs})
    })
}
// 详情页 
module.exports.detail = function(req,res){
    
    let _id = db.objectID(req.query.id)
    //连接数据库
    db.find_One({_id:_id},function(doc){
        res.render('detail',{list:doc})
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
    db.insert_One(obj,function(){
        // 重定向
        res.redirect('/');
    })

}
//添加 add post
module.exports.addPost = function(req,res){
    //post 获得对象
    let obj = req.body;
    db.insert_One(obj,function(){
        // 重定向
        res.redirect('/');
    })
}



