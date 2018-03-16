const mongodb = require('mongodb');
const config = require('./config')

//连接数据库
function connectDB(callback){
    let mc = mongodb.MongoClient;
    //2.连接字符串
    let url = config.mongoUrl;
    //3.连接
    mc.connect(url,function(err,client){
       if(err){
           throw err
       }
       callback(client)
    })
}

//查询所有数据
module.exports.find_All = function(callback){
    connectDB(function(client){
        client.db(config.dbName).collection(config.colName).find().toArray(function(err,docs){
            if(err){
                throw err
            }
            callback(docs)
        })
    })
}

//查询单条数据
module.exports.find_One = function(filter,callback){
    connectDB(function(client){
        client.db(config.dbName).collection(config.colName).findOne(filter,function(err,doc){
            if(err){
                throw err
            }
            client.close();
            callback(doc)
        })
    })
}

//插入单条数据
module.exports.insert_One = function(obj,callback){
    connectDB(function(client){
        client.db(config.dbName).collection(config.colName).insertOne(obj,function(err){
            if(err){
                throw err
            }
            client.close();
            callback()
        })
    })
}

//将字符串转换成objectId
module.exports.objectID = function(strId){
    return  mongodb.ObjectId(strId);
}