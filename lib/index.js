var winston = require('winston');

var logger = new winston.Logger();

var utils = require('./utils');

logger.setup = function setup(config, setMasterConfig) {
    if (setMasterConfig || !this.hasMasterConfig) {
        this.setConfig(config, setMasterConfig);
    }
};

logger.setConfig = function(config, setMasterConfig) {

    if (setMasterConfig) {
        this.hasMasterConfig = true;
    }

    this.teardown();

    config = config || {};
    this.level = config.loglevel || 'debug';

    this.add(winston.transports.Console, (config.transports && config.transports.console) || {
        debugStdout: true,
        label: config.appName || 'not-set',
        timestamp: utils.timestamp,
        formatter: utils.formatter
    });
};

logger.teardown = function teardown() {
    Object.keys(this.transports).forEach(function(transport) {
        this.remove(transport);
    }.bind(this));
};

logger.setup();

module.exports = logger;