var loggerUtils = require('../../lib/utils');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var util = require('util');
var fs = require('fs');

describe('utils', function () {
    describe('#timestamp', function () {
        it('should work', function () {

        });
    });

    describe('#formatter', function () {
        var dateString, options, timestamp;

        beforeEach(function () {
            // Override timestamp function to be able to directly match strings
            dateString = new Date();
            timestamp = function () { return dateString;};
        });

        it('should work with a full set of options', function () {
            // Arrange
            options = {
                level: 'warning',
                label: 'unit-tests',
                timestamp: timestamp,
                message: 'lorem'
            };
            var expectedLog = `[${options.label}] [${options.level.toUpperCase()}] ${dateString} ${options.message}`;

            // Act
            var formatted = loggerUtils.formatter(options);

            // Assert
            expect(formatted).to.equal(expectedLog);
        });

        describe('when given an "meta object"', function () {
            beforeEach(function () {
                // Arrange
                options = {
                    level: 'warning',
                    label: 'unit-tests',
                    timestamp: timestamp,
                    message: 'lorem'
                };

            });

            it('should log a simple value', function () {
                options.meta = 'StringValue';
                var expectedLog = `[unit-tests] [WARNING] ${dateString} lorem : StringValue`;

                // Act
                var formatted = loggerUtils.formatter(options);

                // Assert
                expect(formatted).to.equal(expectedLog);

            });
            it('should not log an empty object', function () {

                options.meta = {};
                var expectedLog = `[unit-tests] [WARNING] ${dateString} lorem`;

                // Act
                var formatted = loggerUtils.formatter(options);

                // Assert
                expect(formatted).to.equal(expectedLog);

            });

            it('should log a plain object', function () {
                // Arrange
                options.meta = {'key': 'value'};
                var expectedLog = `[unit-tests] [WARNING] ${dateString} lorem : { key: 'value' }`;

                // Act
                var formatted = loggerUtils.formatter(options);

                // Assert
                expect(formatted).to.equal(expectedLog);
            });

            it('should log a cyclical object', function () {
                // Arrange
                options.meta = {'key': 'value'};
                // Add a cyclical reference
                options.meta.root = options.meta;

                var metaAsString = "{ key: 'value', root: [Circular] }";
                var expectedLog = `[unit-tests] [WARNING] ${dateString} lorem : ${metaAsString}`;

                // Act
                var formatted = loggerUtils.formatter(options);

                // Assert
                expect(formatted).to.equal(expectedLog);
            });

            it('should log a cyclical linked object', function () {
                // Arrange
                options.meta = {'key': 'value'};
                var alpha = {};
                var beta = {};
                alpha.link = beta;
                beta.link = alpha;

                // Add a cross-linked reference
                options.meta.alpha = alpha;
                options.meta.beta = beta;

                var metaAsString = `{ key: \'value\',\n  alpha: { link: { link: [Circular] } },\n  beta: { link: { link: [Circular] } } }`;
                var expectedLog = `[unit-tests] [WARNING] ${dateString} lorem : ${metaAsString}`;

                // Act
                var formatted = loggerUtils.formatter(options);

                // Assert
                expect(formatted).to.equal(expectedLog);
            });

            describe('should log an error', function () {
                it('without a stack trace', function () {
                    // Arrange
                    try {
                        fs.readFileSync('notexistantfile');

                    } catch (err) {
                        options.meta = err;
                        delete options.meta.stack;
                    };

                    var metaAsString = `{ [Error: ENOENT: no such file or directory, open \'notexistantfile\']\n  errno: -2,\n  code: \'ENOENT\',\n  syscall: \'open\',\n  path: \'notexistantfile\' }`;
                    var expectedLog = `[unit-tests] [WARNING] ${dateString} lorem : ${metaAsString}`;

                    // Act
                    var formatted = loggerUtils.formatter(options);

                    // Assert
                    expect(formatted).to.equal(expectedLog);
                });

                it('with a stack trace', function () {
                    // Arrange
                    options.meta = new Error();

                    // Act
                    var formatted = loggerUtils.formatter(options);

                    // Assert
                    expect(formatted).to.contain('lib/utilsSpec.js');
                });
            });
        });
    });
});
