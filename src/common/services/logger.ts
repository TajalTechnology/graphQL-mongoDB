// Always:
// Application Error/Exception/AnyLevel logging into LogFile [application-file][transports]
// Process Error/Exception logging into LogFile [proc-error-file][exceptionHandlers]

// If Development:
// Application Error/Exception/AnyLevel logging onto Console
// Process Error/Exception logging onto Console
import path from "path";

module.exports = function logger(_label: any) {
    return generateLogger(_label);
};

function generateLogger(_label: any) {
    // var path = require('path');
    var winston = require('winston');
    var DailyRotateFile = require('winston-daily-rotate-file');

    let logs = process.env.LOGS_DIR
    var logDir;
    if (logs) logDir = path.join(logs, path.sep);
    var ext = '.' + process.env.LOG_EXT;

    var transports = [
        new DailyRotateFile({
            dirname: logDir,
            filename: process.env.APP_LOG + '-%DATE%' + ext,
            maxSize: '1g',
        }),
    ];

    var exceptionHandlers = [
        new DailyRotateFile({
            dirname: logDir,
            filename: process.env.PROC_ERROR_LOG + '-%DATE%' + ext,
            handleExceptions: true,
            humanReadableUnhandledException: true,
        }),
    ];

    // If dev Environment please enable console logging
    // if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
        var myFormat = winston.format.printf(function (info: any) {
            var meta = '';
            var level = info.level.toUpperCase();

            // if (info.meta && Object.keys(info.meta).length) {
            //     level === 'ERROR' && (delete info.meta['os']) && (delete info.meta['trace']);
            //     meta = '\n' + JSON.stringify(info.meta, null, 2);
            // }

            // return '[$timestamp][$level][$label]: $msg $meta'.
            //     replace('$timestamp', info.timestamp).
            //     replace('$level', info.level).
            //     replace('$label', info.label).
            //     replace('$msg', info.message).
            //     replace('$meta', meta);
        });
        // transports.push(new winston.transports.Console());
        // exceptionHandlers.push(new winston.transports.Console());
    // }

    return winston.createLogger({
        format: winston.format.combine(
            winston.format.label({ label: _label }),
            winston.format.timestamp(),
            myFormat
        ),
        exitOnError: false,
        transports: transports,
        level: process.env.LOG_LEVEL,
        exceptionHandlers: exceptionHandlers,
    });
}
