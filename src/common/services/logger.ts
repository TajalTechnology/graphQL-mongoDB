import path from "path";

module.exports = function logger(_label: any) {
    return generateLogger(_label);
};

function generateLogger(_label: any) {
    var winston = require("winston");
    var DailyRotateFile = require("winston-daily-rotate-file");

    let logs = process.env.LOGS_DIR;
    var logDir;
    if (logs) logDir = path.join(logs, path.sep);
    var ext = "." + process.env.LOG_EXT;

    var transports = [
        new DailyRotateFile({
            dirname: logDir,
            filename: process.env.APP_LOG + "-%DATE%" + ext,
            maxSize: "1g",
        }),
    ];

    var exceptionHandlers = [
        new DailyRotateFile({
            dirname: logDir,
            filename: process.env.PROC_ERROR_LOG + "-%DATE%" + ext,
            handleExceptions: true,
            humanReadableUnhandledException: true,
        }),
    ];

    var myFormat = winston.format.printf(function (info: any) {
        var meta = "";
        var level = info.level.toUpperCase();
    });
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
