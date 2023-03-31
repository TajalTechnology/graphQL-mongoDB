var logger = require("./logger")("mongoose");
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.Promise.config({
    poolSize: 10,
    warnings: {
        wForgottenReturn: false,
    },
});

var dbURI = process.env.DB_URL;

mongoose.connect(dbURI, function (err: any, db: any) {
    if (err) {
        logger.error("Unable to connect to the database:", err);
    } else {
        console.log("Database Connection has been established successfully.");
        logger.info("Database Connection has been established successfully.");
    }
});

mongoose.Model.handleResponse = function (
    _promise: { spread: (arg0: (_record: any, _status: any) => void) => any },
    _res: { apiSuccess: (arg0: any) => void }
) {
    var model = this;
    return _promise.spread(function (_record, _status) {
        /* eslint-disable indent */
        switch (_status) {
            case -1:
            case false:
                model.returnAlreadyExistsError(_res);
                break;
            case 0:
                model.returnDoesNotExistsError(_res);
                break;
            case 2:
                model.returnEmptyResponseError(_res);
                break;
            default:
                _res.apiSuccess(_record);
                break;
        }
        /* eslint-enable indent */
    });
};

mongoose.Model.handleDoesNotExistsCatch = function (
    _promise: Promise<any>,
    _res: any
) {
    var model = this;
    return _promise.catch(function (_error) {
        console.log(_error);
        model.returnDoesNotExistsError(_res);
    });
};

mongoose.Model.handleAlreadyExistsCatch = function (
    _promise: Promise<any>,
    _res: any
) {
    var model = this;
    return _promise.catch(function (_error) {
        console.log(_error);
        model.returnAlreadyExistsError(_res);
    });
};

mongoose.Model.handleEmptyResponseCatch = function (
    _promise: Promise<any>,
    _res: any
) {
    var model = this;
    return _promise.catch(function (_error) {
        console.log(_error);
        model.returnEmptyResponseError(_res);
    });
};

mongoose.Model.titleCase = function (string: string) {
    var split = string.toLowerCase().split(" ");
    for (var i = 0; i < split.length; i++) {
        split[i] = split[i].charAt(0).toUpperCase() + split[i].substring(1);
    }
    return split.join(" ");
};

module.exports = mongoose;
