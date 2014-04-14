require('url');

var assert = require('assert')
  , util   = require('util')
  , appConfig
  , appData
  , appShell
  , voidFilterRoutes;

/**
 * Checks whether the request is a REST API JSON request
 * @param  {http.ServerRequest} req     Node.js HTTP Server request
 * @return {Boolean}    true if request headers match 'application/json', false otherwise
 * @author  Tomislav Capan
 */
function _isJsonRequest(req) {
  return (/application\/json/).test(req.headers.accept);
}


/**
 * Checks whether the route is in the list of routes to void filtering on
 * @param  {http.ServerRequest} req     Node.js HTTP Server request
 * @return true if request headers match 'application/json', false otherwise
 * @return {Boolean} true if route (path) in the list of routes to void filtering on, false otherwise
 * @author  Tomislav Capan
 */
function _isVoidFilterRoute(req) {
  var reqPathRegex = new RegExp(['^', req.path.replace(/\/$/, ''), '$'].join(''), 'i')
    , voidRoute
    , i;

  for (i=0; i<voidFilterRoutes.length; i++) {
    if (reqPathRegex.test(voidFilterRoutes[i])) { return true; }
  }
  return false;
}


/**
 * Default method to render app shell, could be overriden through init options
 * @return _void_
 * @author Tomislav Capan
 */
function _renderAppShell(res) {
  res.render(appShell.view, {
      layout    : appShell.layout
    , appTitle  : appConfig.appTitle
    , appConfig : JSON.stringify(appConfig)
    , appData   : JSON.stringify(appData)
  });
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
    if (!_isJsonRequest(req) && !_isVoidFilterRoute(req)) {
      return _renderAppShell(res);
    }
    next();
  };
}

/**
 * Initializes the middleware by setting the required options for it to run
 * and exposing the filtering interface
 * @param  {object}   options   Options object containing the following:
 *                                * app: A reference to the Express app object
 *                                * voidFilterRoutes: an array of routes (paths) to void filtering on
 * @return {function}           The requestFilter function doing the filtering
 * @author Tomislav Capan
 */
function configure(options) {
  options = options || {};
  var assertErrTemplate = '[connect-spa-request-filter middleware :: configure()] Fatal error! Missing parameter:';

  assert(options.appConfig, util.format(assertErrTemplate, 'options.appConfig'));
  assert(options.appConfig.appTitle, util.format(assertErrTemplate, 'options.appConfig.appTitle'));

  appConfig        = options.appConfig;
  appData          = options.appData  || {};
  appShell         = options.appShell || {};
  voidFilterRoutes = options.voidFilterRoutes || [];

  appShell.view    = appShell.view   || 'index';
  appShell.layout  = appShell.layout || false;


  // Publicly expose the module interface after initialized
  return requestFilter;
}

// Publicly expose function from the module
module.exports = {
  configure: configure
};
