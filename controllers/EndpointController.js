//节点控制器
const { Endpoint } = require('../models')
//导入日志模块
const log4js =require('../config/logConfig');
const logerr = log4js.getLogger('err');
const logger = log4js.getLogger('req');
module.exports = {
    //获取节点列表
    async getEndpointList (req, res) {
        try{
            logger.info(req)
            const endpoints = await Endpoint.findAll({where:{email:req.body.email}})
            res.send({
                code:200,
                endpoints:endpoints,
            })
        }
        catch (error){
            res.send({
                code: 400,
                error: '获取节点列表失败'
            })
            logerr.error('getEndpointList fail')
        }
    },
    //新增节点
    async addEndpoint(req, res) {
        try{
            const endpoint = await Endpoint.create(req.body);
            res.send({
                code:200,
                endpoint: endpoint,
            })
        }
        catch (error){
            res.send({
                code: 400,
                error: '节点添加失败'
            })
           
        }
    }
}