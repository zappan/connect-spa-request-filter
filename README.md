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
parameters and prerequisites. It expects to receive an `options` object
containing the following items

* `appShell` - _optional_ hash object containing options to render
the application shell HTML. _Supported_ fields are:
  * `view` - indicates the name of the view (template) to render
  (default: `'index'`)
  * `layout` - indicates whether view should be rendered in a master
  layout (default: `false`)
* `appConfig` - _required_ hash object with application configuration.
_Required_ fields:
  * `appTitle` - used to render the application shell HTML `<title>` tag
  * the whole object will be passed to the client-side through the app shell
  `<script>` tag
  * it can contain any additional config needed by the client-side app
* `appData` - _optional_ hash object with application bootstrap data
  * default: `{}`
  * the whole object will be passed to the client-side through the app shell
  `<script>` tag
  * it should contain any initial set of data for the client-side app
* `voidFilterRoutes` - _optional_ array of routes to void filtering on
  * default: `[]`


Example of the middleware initialization and usage:

    var express   = require('express')
      , ReqFilter = require('connect-spa-request-filter')
      , app       = express()
      , reqFilter;

    reqFilter = ReqFilter.configure({
      appConfig       : { appTitle: 'My Super Single Page App' },
      appData         : {},
      appShell        : { view: 'index', layout: false },
      voidFilterRoutes: ['/logout']
    });

    // NOTE: use reqFilter **after** static middleware so it doesn't intercept static content serving
    app.use(reqFilter());


## History

  * **0.3.0** - [2014-04-14] Included rendering of the app shell within the middleware, with configurable options
  * **0.2.2** - [2014-04-14] Relaxing lodash version dependency
  * **0.2.1** - [2013-xx-xx] _Unpublished. Because reasons._
  * **0.2.0** - [2013-05-09] Adding an option to void filtering on a defined set of routes
  * **0.1.0** - [2013-04-22] Initial release

## License

This library is licensed under the **MIT License**
