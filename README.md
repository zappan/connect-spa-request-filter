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


## History

  * **0.1.0** - [2013-04-22] Initial release

## License

This library is licensed under the **MIT License**
