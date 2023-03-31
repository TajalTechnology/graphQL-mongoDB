/* no stacktraces leaked to user */
module.exports = function(_app: { locals: { dirname: any; baseUri: any; }; use: (arg0: any, arg1: any) => void; }) {
  var fs = require('fs');
  var path = require('path');
  var routes = path.join(_app.locals.dirname, 'api');

  fs.readdirSync(routes).forEach(function(_item: any) {
    var index = path.join(routes, 'index');
    var base = _app.locals.baseUri;
    _app.use(base, require(index));
  });
};
