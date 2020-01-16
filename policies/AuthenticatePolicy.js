const Jwt = require('jsonwebtoken')
const config = require('../config/database')
function tokenVerify(token){
    try{
        Jwt.verify(token, config.token.secretOrPrivateKey);
        return true
    }catch{
        return false
    }
}

module.exports = {
    isValidToken(req, res, next){
        let token = req.headers.authorization //这是个坑  注意前端请求时候带的时Authorization 到后端就变小写了
        try{
            if(tokenVerify(token)){
                next()
            }else{
                res.status(403).send({
                    code: 403,
                    error: '登录凭证无效请重新登录'
                })
            }
        }catch(error){
            res.status(401).send({
                status: 401,
                error: '请登录后再访问'
            })
        }
    }
}