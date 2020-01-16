const path = require('path');
const log4js =require('../config/logConfig');
const logger = log4js.getLogger('sql');
module.exports = {
    db: {
        database: process.env.DATABASE || 'movie',
        username: 'movie',
        password: 'movie',
        options: {
            host: 'localhost',
            dialect: 'sqlite',
            storage: path.resolve(__dirname, '../db/movie.sqlite'),
            define: {
                underscored: true,
                paranoid: true
            },
            logging:function(sql){
                logger.info(sql)
            }
        }
    },
    token: {
        secretOrPrivateKey: 'movie',
        options:{
            expiresIn:'1h'
        }
    }
}