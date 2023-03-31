var path = require('path');
module.exports = {
  'instance': false,
  'init': function(_app: { locals: { appdirname: any; }; }) {
    var label = _app.locals.appdirname;
    var service = __filename.replace(__dirname, '').replace('.js', '');
    service = path.join('../../../common', 'services', service).replace(/\\/g, '/');
    return this.instance = require(service)(label);
  },
  'get': function() {
    if (!this.instance) {
      throw new Error('Trying to get logger service without initializing it.');
    }
    return this.instance;
  },
};
