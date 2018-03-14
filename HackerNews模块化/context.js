const fs = require('fs');
const _ = require('underscore');

module.exports = function(res){
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
}