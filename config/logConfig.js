
const log4js = require('log4js')
log4js.configure({
    replaceConsole: true,
    appenders: {
        stdout: {//控制台输出
            type: 'stdout'
        },
        req: {//请求日志
            type: 'dateFile',
            filename: 'logs/reqLog/request',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true

        },
        err: {//错误日志
            type: 'dateFile',
            filename: 'logs/errLog/error',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true

        },
        sql: {//其他日志
            type: 'dateFile',
            filename: 'logs/sqlLog/sql',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true

        },
        oth: {//其他日志
            type: 'dateFile',
            filename: 'logs/othLog/other',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true

        }

    },

    categories: {
        default: { appenders: ['stdout', 'req'], level: 'debug' },//appenders:采用的appender,取appenders项,level:设置级别
        err: { appenders: ['stdout', 'err'], level: 'error' },
        oth: { appenders: ['stdout', 'oth'], level: 'info' },
        sql: { appenders: ['stdout', 'sql'], level: 'info' },
        req: { appenders: ['stdout', 'req'], level: 'debug' }

    }

})


exports.getLogger = function (name) {//name取categories项
    return log4js.getLogger(name || 'default')
}

exports.useLogger = function (app, logger) {//用来与express结合
    app.use(log4js.connectLogger(logger || log4js.getLogger('default'), {
        format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]'//自定义输出格式
    }))
}
