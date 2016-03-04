# rtp-logger  [![Build Status](https://img.shields.io/travis/UKHomeOffice/rtp-logger.svg)](https://travis-ci.org/UKHomeOffice/rtp-logger)

Thin wrapper around [winston](https://www.npmjs.com/package/winston) for use in Registered Traveller Programme node.js applications.

## Usage

To use the logger simply add **rtp-logger** to your dependencies in the `package.json` and then require it in your main javascript file.

The default are as follows: -
- Console transport logging to stdout and stderr
- Log level = debug
- Include timestamps on log entries

``` 
  logger.info('message');
```

To log objects, simply pass an additional parameter to the logging function. This will be Stringified using the `util.inspect` module


``` 
  logger.error('message', {'key': 'value});
```

### Configuration

To configure the logger further you can use the `setup()` function, passing an object. Below is an example of the options that can be used: -

``` JavaScript
{
    loglevel: 'info',
    appName: 'MY-APP', // will appear as [MY-APP] in log entries
    transports: {
        console: {
            // any valid winston config options when creating a console transport
            timestamp: false,
            debugStdout: false
        }
    }
}
```

## Run tests

The unit tests are written in mocha and can be run using npm. 
```
npm test
```

You can also run the tests using grunt. Before running the unit tests it will perform a run jshint and jscs. From the project root, run the following: -

```
grunt dev
```

If you would like to watch all javascript files and automatically re-run jshint, jscs and mocha you can use the following: -

```
grunt watch
```

## File transport

File logging is not currently a requirement as all logs file are created from stdout and stderr and will be for the foreseeable future. However, the code to handle configuration of a file transport was written and is available in the `file-transport` branch. Should this be required at a later date, it could be merged into the master branch and used.

To configure the logger with a file transport you can use the `setup()` function, passing an object. Below is an example of the options that can be used: -

``` JavaScript
{
    logLocation: '/log/test.log'
    transports: {
        file: {
            // any valid winston config options when creating a file transport
            filename: 'some-log-file.log', // this would override logLocation
            timestamp: false,
            maxsize: 128,
            maxFiles: 1
        }
    }
}
```

The existence of `logLocation` or `transports.file` in the config will trigger the addition of a file transport to the logger.

If only `logLocation` is present then the default config for a file transport will be used, this is as defined here.

``` JavaScript
{
    filename: // logLocation or 'app.log'
    timestamp: true,
    maxsize: 10240,
    maxFiles: 3
}
```

The Registered Traveller Programme uses BrowserStack for mobile and desktop testing https://www.browserstack.com/
