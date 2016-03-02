var logger = require('../../lib/index');
var chai = require('chai');
var expect = chai.expect;
var stdMocks = require('std-mocks');

describe('Logger', function() {

    /*jshint expr:true */
    it('should have only the console transport by default', function() {
        expect(Object.keys(logger.transports).length).to.equal(1);
        expect(logger.transports.console).to.exist;
        expect(logger.transports.console).to.have.property('name', 'console');
    });

    it('should have debug, info, warn and error log levels', function() {
        expect(logger).to.include.keys(['debug', 'info', 'warn', 'error']);
    });

    it('should have the default log level set to "debug"', function () {
        expect(logger.level).to.equal('debug');
    });

    describe('#teardown function', function() {

        it('should remove all transports from the logger', function() {
            logger.teardown();
            expect(logger.transports).to.be.empty;
        });

    });

    describe('transports', function() {

        describe('console transport', function() {

            before('Set logger to defaults', function () {
                logger.setup();
            });

            beforeEach(function() {
                stdMocks.use();
            });

            ['debug', 'info', 'warn'].forEach(function (level) {
                it(level + ' should log to the console via stdout', function() {
                    logger[level]('test log message');
                    stdMocks.restore();
                    var output = stdMocks.flush();
                    expect(output.stdout.length).to.equal(1);
                    var re = new RegExp(level + ': [0-9-]{10} [0-9:]{8} \\[not-set\\] test log message');
                    expect(output.stdout[0]).to.match(re);
                });
            });

            it('error should log to the console via stderr', function() {
                logger.error('test log message');
                stdMocks.restore();
                var output = stdMocks.flush();
                expect(output.stderr.length).to.equal(1);
                expect(output.stderr[0]).to.match(/error: [0-9-]{10} [0-9:]{8} \[not-set\] test log message/);
            });

            it('should log objects', function() {
                // Arrange

                // Act
                logger.info('message', {'key': 'value'});
                stdMocks.restore();
                var output = stdMocks.flush();

                // Assert
                expect(output.stdout.length).to.equal(1);

                var message = output.stdout[0];
                expect(message).to.contain('message');
                expect(message).to.contain('key');
            });
        });

    });

    describe('#setup function can be used to change the way the logger works', function () {

        beforeEach('Reset the logger', function () {
            logger.setup();
        });

        describe('transports', function () {

            it('should default to only a console transport if not specified', function () {
                expect(Object.keys(logger.transports).length).to.equal(1);
                expect(logger.transports.console).to.exist;
                expect(logger.transports.console).to.have.property('name', 'console');
            });

            describe('console transport', function() {

                it('should use default options if not specified', function() {
                    expect(logger.transports.console.stderrLevels).to.not.have.property('debug');
                    expect(logger.transports.console).to.have.property('label', 'not-set');
                    expect(logger.transports.console.timestamp).to.be.a('function');
                    expect(logger.transports.console.formatter).to.be.a('function');
                });

                it('should use options if specified in the config', function() {
                    logger.setup({
                        transports: {
                            console: {
                                debugStdout: false
                            }
                        }
                    });
                    expect(logger.transports.console.stderrLevels).to.have.property('debug', true);
                });

            });

        });

        describe('loglevel', function () {

            it('should set the default log level to "debug" when not specified', function () {
                expect(logger.level).to.equal('debug');
            });

            it('should set the log level', function () {
                logger.setup({
                    loglevel: 'error'
                });
                expect(logger.level).to.equal('error');
            });

        });

        describe('appName', function() {

            describe('console transport', function() {

                it('should set the default label to "not-set" when not specified', function() {
                    logger.setup();
                    expect(logger.transports.console).to.have.property('label', 'not-set');
                });

                it('should be used as the label on log entries', function() {
                    logger.setup({
                        appName: 'TEST-APP'
                    });
                    stdMocks.use();
                    logger.info('test log entry');
                    stdMocks.restore();
                    var output = stdMocks.flush();
                    expect(output.stdout.length).to.equal(1);
                    expect(output.stdout[0]).to.match(/info: [0-9-]{10} [0-9:]{8} \[TEST-APP\] test log entry/);
                });

            });

            describe('Conditional overridability of the config', function() {

                beforeEach(function() {
                    logger.setup();
                });

                afterEach(function() {
                    logger.hasMasterConfig = false;
                });

                it('cannot set the config again once the masterConfig has been set', function() {
                    logger.setup({ appName : 'apple'});
                    expect(logger.transports.console.label).to.equal('apple');
                    logger.setup({ appName : 'cherry'});
                    expect(logger.transports.console.label).to.equal('cherry');
                    logger.setup({ appName : 'orange'}, true);
                    expect(logger.transports.console.label).to.equal('orange');
                    logger.setup({ appName : 'apple'});
                    expect(logger.transports.console.label).to.equal('orange');
                });

            });

        });

    });

});
