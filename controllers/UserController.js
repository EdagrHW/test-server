const { User } = require('../models')
const config = require('../config/database')
const Jwt =require('jsonwebtoken')
//导入日志模块
const log4js =require('../config/logConfig');
const logerr = log4js.getLogger('err');
const logger = log4js.getLogger('req');

function tokenSign({ id, email }){
    try{
        return Jwt.sign({ id, email }, config.token.secretOrPrivateKey, config.token.options);
    }catch(error){
        throw(error)
    }
}


module.exports = {
    async register (req, res) {
        console.log(req.body)
        try{
            const user = await User.create(req.body);
            if(user){
                res.send({
                    code:200,
                    username:user.email,
                    token: tokenSign(user)
                })
                logger.info("用户:" + user.toJSON() + ",注册成功")
            }else{
                logerr.error("注册失败!!!")
            }
            
        }
        catch (error){
            res.send({
                code: 400,
                error: '该邮箱已经注册'
            })
            logerr.error(error)
           
        }
    },
    async getUserById (req, res) {
        try{
            const user = await User.findByPk(req.params.id);
            res.status(201).send({
                user
            })
        }
        catch (error){
            res.status(500).send({
                code: 500,
                error: '数据查询失败'
            })
           
        }
    },
    async update (req, res) {
        try{
            const user = await User.update(
                req.body,
                {
                    where: {
                        id: req.params.id
                    }
                }
            );
            res.status(200).send({
               message:'数据更新成功'
            })
        }
        catch (error){
            res.status(500).send({
                code: 500,
                error: '数据更新失败'
            })
           
        }
    },
    async delete (req, res) {
        try{
            const user = await User.destroy(
                {
                    where: {
                        id: req.params.id
                    }
                });
            res.status(200).send({
               message:'数据删除成功'
            })
        }
        catch (error){
            res.status(500).send({
                code: 500,
                error: '数据删除失败'
            })
           
        }
    },


    async login (req, res) {
        logger.info(req)
        try{
            const user = await User.findOne(
            {
                where: {
                    email: req.body.email
                }
            });
            if(user){
                let isVaildPassword = user.comparePassword(req.body.password)
                if(isVaildPassword){
                    res.send({
                        code: 200,
                        username: user.email,
                        token: tokenSign(user)
                    })
                    logger.info('用户' + user.email + '登录成功')
                }else{
                    res.send({
                        code: 403,
                        error: '密码错误'
                    })
                    logerr.error('用户' + user.email + '登录密码错误')
                }

            }else{
                res.send({
                    code: 403,
                    error: '用户不存在'
                })
                logerr.error('用户' + user.email + '不存在')
            }
            
        }
        catch (error){
            res.send({
                code: 403,
                error: '用户名或密码错误'
            })
            logerr.error(error)
           
        }
    }
}