# Connect Single Page Apps Request Filter Middleware

A Node.js [Connect framework](https://github.com/senchalabs/connect)
*middleware* for Single Page Applications APIs that filters requests
by type, intercepting requests that aren't of 'application/json' type
serving them the application shell HTML file, instead of passing them
through to the API handlers.

This middleware takes care of the same Node.js server (Express.js app)
at the same time and via the same URLs to serve both the application's
JSON API endpoints and appliations assets needed for the browser to run
the application.

## Usage

For the middleware to run, it needs to be initialized with the proper
parameters and prerequisites. It expects two things: (1) to receive
an `options` object containing the Express application on `init()`
call; and (2) Express application instance has to have a
`renderAppShell(res, appConfig, appData)` method defined on it.

`renderAppShell(res, appConfig, appData)` is a function that knows
how to render the client-side single page application shell HTML file,
and needs to be defined on the Express application instance by the
developer. This middleware doesn't imply the implementation aside
of the function's signature and the requirement of its existence.

Optionally, an array of routes to void filtering on may be passed in
options hash as `voidFilterRoutes` attribute (see example below).


Example of `renderAppShell(res, appConfig, appData)` function (can be defined in `app.js`):

    function _renderAppShell(res, appConfig, appData) {
      appConfig = appConfig || {};
      appData = appData || {};

      res.render('index', {
          layout    : false
        , appTitle  : appConfig.appTitle
        , appConfig : JSON.stringify(appConfig)
        , appData   : JSON.stringify(appData)
      });
    }

    app.renderAppShell = _renderAppShell


Example of the middleware initialization and usage:

    var express   = require('express')
      , ReqFilter = require('connect-spa-request-filter')
      , app       = express()
      , reqFilter;

    app.renderAppShell = _renderAppShell;
    reqFilter = ReqFilter.init({
        app: app
      , voidFilterRoutes: ['/logout']
    });

    app.configure(function() {
      // NOTE: use reqFilter **after** static middleware so it doesn't intercept static content serving
      app.use(reqFilter());
    });


## History

  * **0.2.2** - [2014-04-14] Relaxing lodash version dependency
  * **0.2.1** - [2013-xx-xx] _Unpublished. Because reasons._
  * **0.2.0** - [2013-05-09] Adding an option to void filtering on a defined set of routes
  * **0.1.0** - [2013-04-22] Initial release

## License

This library is licensed under the **MIT License**
