require('url');

var assert  = require('assert')
  , app;

/**
 * Checks whether the request is a REST API JSON request
 * @param  {http.ServerRequest} req     Node.js HTTP Server request
 * @return true if request headers match 'application/json', false otherwise
 * @author  Tomislav Capan
 */
function _isJsonRequest(req) {
  return (/application\/json/).test(req.headers.accept);
}


/**
 * Intercepts request to check whether it is an 'application/json' type
 * request which gets passed through, otherwise it breaks the request chain
 * serving the Single Page Application HTML shell file.
 * @return _void_
 * @author Tomislav Capan
 */
function requestFilter() {
  return function(req, res, next) {
    if (!_isJsonRequest(req)) {
      var appConfig = app.get('config') || {};
      app.renderAppShell(res, appConfig);
      return;
    }
    next();
  };
}

/**
 * Initializes the middleware by setting the required options for it to run
 * and exposing the filtering interface
 * @param  {object}   options   Options object containing the following:
 *                                * app: A reference to the Express app object
 * @return {function}           The requestFilter function doing the filtering
 * @author Tomislav Capan
 */
function init(options) {
  options = options || {};
  var assertErrTemplate = '[connect-spa-request-filter middleware :: init()] Fatal error! Missing parameter:';

  assert(options.app, [assertErrTemplate, 'options.app'].join(' '));
  assert(options.app.renderAppShell, [assertErrTemplate, 'options.app.renderAppShell()'].join(' '));

  app = options.app;

  // Publicly expose the module interface after initialized
  return requestFilter;
}

// Publicly expose function from the module
module.exports = {
  init: init
};
