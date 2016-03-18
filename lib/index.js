var winston = require('winston');
var utils = require('./utils');
var nodeUtil = require('util');

function Logger() {}

function createInstance() {
    if (global.sharedLogger) {
        return global.sharedLogger
    } else {
        nodeUtil.inherits(Logger, winston.Logger);

        Logger.prototype.setup = function setup(config, setMasterConfig) {
            if (!this.hasMasterConfig) {
                this.configure({
                    transports : [new winston.transports.Console({
                        label : 'not-set',
                        debugStdout: true,
                        timestamp: utils.timestamp,
                        formatter: utils.formatter
                    })]
                });

                this.level = config && config.loglevel ? config.loglevel : 'debug';
            }

            if (config && (setMasterConfig || !this.hasMasterConfig)) {
                this.setConfig(config, setMasterConfig);
            }

            return this;
        };

        Logger.prototype.setConfig = function(config, setMasterConfig) {
            if (setMasterConfig) {
                this.hasMasterConfig = true;
            }

            this.teardown();

            if (config.logLevel) {
                this.level = config.logLevel;
            }

            this.add(winston.transports.Console, (config.transports && config.transports.console) || {
                    debugStdout: true,
                    label: config.appName || 'not-set',
                    timestamp: utils.timestamp,
                    formatter: utils.formatter
                });
        };

        Logger.prototype.teardown = function teardown() {
            Object.keys(this.transports).forEach(function(transport) {
                this.remove(transport);
            }.bind(this));
        };

        return global.sharedLogger = new Logger().setup();
    }
}

module.exports = createInstance();


