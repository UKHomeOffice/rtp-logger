var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

describe('The behaviour of the module as a former singleton ', function() {

    function getAppName(instance) {
        return (instance &&
        instance.transports &&
        instance.transports.console &&
        instance.transports.console.label) ?
            instance.transports.console.label : undefined;
    }

    function deleteModuleFromCache() {
        delete require.cache[require.resolve('../../lib/index.js')];
    }

    function properTeardown() {
        if (global.sharedLogger) {
            global.sharedLogger.teardown();
            global.sharedLogger = null;
        }
        deleteModuleFromCache();
    }

    describe('When it\'s cached by npm', function() {

        var instance1, instance2;

        before(function() {
            properTeardown();

            instance1 = require('../../lib/index.js');
            instance2 = require('../../lib/index.js')
        });

        it('demonstrates they end up being the same instance', function() {
            instance1.randomInstanceProperty = 'bigCheeze';
            expect(instance2.randomInstanceProperty).to.equal('bigCheeze');
        });

        it('sets the application name on both instances', function() {
            instance1.setup({
                appName : 'myNiceAppName'
            });
            expect(getAppName(instance1)).to.equal('myNiceAppName');
            expect(getAppName(instance2)).to.equal('myNiceAppName');
        });

        it('gets a master config for all instances, such master config overrides future "normal" configs', function() {
            instance1.setup({
                appName : 'myNiceAppName'
            });

            expect(getAppName(instance2)).to.equal('myNiceAppName');

            instance1.setup({
                appName : 'otherName'
            });

            expect(getAppName(instance2)).to.equal('otherName');

            instance1.setup({
                appName : 'masterName'
            }, true);

            expect(getAppName(instance2)).to.equal('masterName');

            instance1.setup({
                appName : 'notInMyName'
            });

            expect(getAppName(instance2)).to.equal('masterName');

            instance2.setup({
                appName : 'anotherName'
            });

            expect(getAppName(instance1)).to.equal('masterName');
            expect(getAppName(instance2)).to.equal('masterName');
        });

    });

    describe('When it\'s not cached by npm', function() {
        var instance1, instance2;

        beforeEach(function() {
            properTeardown();

            instance1 = require('../../lib/index.js');
            deleteModuleFromCache();
            instance2 = require('../../lib/index.js');
        });

        it('demonstrates they are still the same instance', function() {
            instance1.randomInstanceProperty = 'bigCheeze';
            expect(instance2.randomInstanceProperty).to.equal('bigCheeze');
        });

        it('gets a master config for all instances, such master config overrides future "normal" configs', function() {
            instance1.setup({
                appName : 'myNiceAppName'
            });

            expect(getAppName(instance1)).to.equal('myNiceAppName');
            expect(getAppName(instance2)).to.equal('myNiceAppName');

            instance1.setup({
                appName : 'otherName'
            });

            expect(getAppName(instance2)).to.equal('otherName');

            instance1.setup({
                appName : 'masterName'
            }, true);

            expect(getAppName(instance2)).to.equal('masterName');

            instance1.setup({
                appName : 'notInMyName'
            });

            expect(getAppName(instance2)).to.equal('masterName');

            instance2.setup({
                appName : 'anotherName'
            });

            expect(getAppName(instance1)).to.equal('masterName');
            expect(getAppName(instance2)).to.equal('masterName');
        });

    });

    describe('cached and not cached behaving the same', function() {
        var instance1, instance2, instance3;

        beforeEach(function() {
            properTeardown();

            instance1 = require('../../lib/index.js');
            instance2 = require('../../lib/index.js');
            deleteModuleFromCache();
            instance3 = require('../../lib/index.js');
        });

        it('demonstrates they are still the same instance', function() {
            instance1.randomInstanceProperty = 'bigCheeze';
            expect(instance2.randomInstanceProperty).to.equal('bigCheeze');
            expect(instance3.randomInstanceProperty).to.equal('bigCheeze');
        });

        it('gets a master config for all instances, such master config overrides future "normal" configs', function() {
            instance1.setup({
                appName : 'myNiceAppName'
            });

            expect(getAppName(instance1)).to.equal('myNiceAppName');
            expect(getAppName(instance2)).to.equal('myNiceAppName');
            expect(getAppName(instance3)).to.equal('myNiceAppName');

            instance1.setup({
                appName : 'otherName'
            });

            expect(getAppName(instance2)).to.equal('otherName');
            expect(getAppName(instance3)).to.equal('otherName');

            instance1.setup({
                appName : 'masterName'
            }, true);

            expect(getAppName(instance2)).to.equal('masterName');
            expect(getAppName(instance3)).to.equal('masterName');

            instance1.setup({
                appName : 'notInMyName'
            });

            expect(getAppName(instance2)).to.equal('masterName');
            expect(getAppName(instance3)).to.equal('masterName');

            instance2.setup({
                appName : 'anotherName'
            });

            expect(getAppName(instance1)).to.equal('masterName');
            expect(getAppName(instance2)).to.equal('masterName');
            expect(getAppName(instance3)).to.equal('masterName');
        });

        it('is not unset by further instantiations, unless it\'s a master config', function() {
            var instance4;
            instance1.setup({
                appName : 'myNiceAppName'
            });

            expect(getAppName(instance1)).to.equal('myNiceAppName');
            expect(getAppName(instance2)).to.equal('myNiceAppName');
            expect(getAppName(instance3)).to.equal('myNiceAppName');

            instance1.setup({
                appName : 'otherName'
            });

            expect(getAppName(instance1)).to.equal('otherName');
            expect(getAppName(instance2)).to.equal('otherName');
            expect(getAppName(instance3)).to.equal('otherName');

            deleteModuleFromCache();

            instance4 = require('../../lib/index.js');

            expect(getAppName(instance4)).to.equal('otherName');

            instance4.setup({
                appName : 'masterName'
            }, true);

            expect(getAppName(instance1)).to.equal('masterName');
            expect(getAppName(instance2)).to.equal('masterName');
            expect(getAppName(instance3)).to.equal('masterName');
            expect(getAppName(instance4)).to.equal('masterName');
            instance4.setup({
                appName : 'notThisName'
            });
            expect(getAppName(instance1)).to.equal('masterName');
            expect(getAppName(instance2)).to.equal('masterName');
            expect(getAppName(instance3)).to.equal('masterName');
            expect(getAppName(instance4)).to.equal('masterName');
        })
    })

});