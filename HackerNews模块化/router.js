const handler = require('./handler');

module.exports = function(req,res){
    //首页
    if(req.url=='/'||req.url=='/index'){
       handler.index(res);
    }
    //详情页
    else if(req.url=='/detail'){
        handler.detail(req,res);
    }
    //提交页
    else if(req.url=='/submit'){
        handler.submit(res);
    }
    //添加 add get
    else if(req.url.startsWith('/add')&&req.method=='GET'){
        handler.addGet(req,res);
    }
    //添加 add post
    else if(req.url=='/add'&&req.method=='POST'){
        handler.addPost(req,res);
    }
    //静态资源
    else if(req.url.startsWith('/resources')){
        handler.static(req,res);
    }
    //其他
    else{
        res.end('404 no found page')
    }
}
