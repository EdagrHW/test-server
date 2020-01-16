//从配置文件中读取要进入的docker remote host port 
/*
    data = {
        host: '127.0.0.1',
        port: 9000
    }
*/
//导入日志模块
const log4js =require('../config/logConfig');
const logerr = log4js.getLogger('err');
const logger = log4js.getLogger('req');

const path = require('path');
const fs = require('fs');
const configPath = path.join(__dirname, 'test.json'); //配置文件路径
//读取配置文件
function getRemoteApi(){
    var config = null
    try{
        config = fs.readFileSync(configPath,'utf8');
        config = JSON.parse(config);
    }catch(error){
        console.log("读取配置文件"+ configPath +"失败")
    }
    return config
    
}
var remoteApiConfig = getRemoteApi()

var http = require('http');
var remote = {
    getData: function(path, callback){
        http.get({
            hostname: remoteApiConfig.host,
            port: remoteApiConfig.port,
            path: path
        }, function(res){
            var body = [];
            res.on('data', function(chunk){
                body.push(chunk);
            });
            res.on('end', function(){
                body = Buffer.concat(body);
                callback(body.toString());
            });
        }).on('error', (e) => {
            logerr.error(`出现错误: ${e}`);
            callback(e)
        });
    },

    postData: function(path, data, callback){
        var content = data || {};
        content = JSON.stringify(content)
        console.log(content)
        var options = {
            host: remoteApiConfig.host,
            port: remoteApiConfig.port,
            path: path,
            method: 'POST',
            headers:{
                //"Content-Type": "application/x-www-form-urlencoded", //for url parameter
                "Content-Type": "application/json", // for json data
                "Content-Length": content.length
            }
        };
        let req = http.request(options, function(res){
            var _data = '';
            res.on('data', function(chunk){
                _data += chunk;
            });
            res.on('end', function(){
                callback(_data);
            });
            
        }).on('error', (e) => {
            logerr.error(`出现错误: ${e}`);
            callback(e)
        });
        req.write(content);
        req.end()
        
    },

    deleteData: function(path, callback){
        var options = {
            host: remoteApiConfig.host,
            port: remoteApiConfig.port,
            path: path,
            method: 'DELETE',
        };
        let req = http.request(options, function(res){
            var _data = '';
            res.on('data', function(chunk){
                _data += chunk;
            });
            res.on('end', function(){
                callback(_data);
            });
            
        }).on('error', (e) => {
            console.error(`出现错误: ${e.code}`);
            callback(e)
        });
        req.end()
        
    }
};

module.exports = {
//转发get请求
getApi(req, res){
    var path = req.originalUrl.toString();
    path = path.replace("/api", '');
    //存储日志信息
    logger.info("method: get,  url:"+path);
    remote.getData(path, function(data){
        res.send(data)
    });
},
//转发delete请求
deleteApi(req, res){
    var path = req.originalUrl.toString();
    path = path.replace("/api", '')
    logger.info("method: delete,  url:"+path);
    remote.deleteData(path, function(data){
        res.send(data)
    });
},
//转发post请求
postApi(req, res){
    var path = req.originalUrl.toString();
    path = path.replace("/api", '')
    var data = req.body;
    //存储日志信息
    logger.info("method: post,  url:"+path + " ,data:"+data);
    remote.postData(path, data, function(data){
        res.send(data)
    });
},

//更新远程api的ip和端口
update(req, res){
    var data = req.body
    //存储日志信息
    logger.info("method: post,  url:"+req.originalUrl.toString() + " ,data:"+data);
    data = JSON.stringify(data);
    try{
        fs.writeFileSync(configPath, data)
        remoteApiConfig = getRemoteApi()
        if(remoteApiConfig === null){
            res.send({ code:'404', error:'读取配置文件失败'})
            logerr.error('read ' + configPath +' fail')
        }else{
            res.send({code:'200',error:'设置成功'})
            logger.info('updated remote api’s host and port success')
        }
    }catch(error){
        res.send({code:'404',error:'写文件失败'})
        logerr.error('write ' + configPath +' fail')
    }
},


}











































































