var util = require('util');

module.exports = {
    timestamp: function() {
        var currentDate = new Date().toISOString();
        return currentDate.substring(0, 10) + ' ' + currentDate.substring(11, 19);
    },
    formatter: function(options) {
        var metaAsString;
        var returnString =  `${options.level}: ${options.timestamp()} [${options.label}] ${options.message}`;

        if(options.meta) {

            if (util.isPrimitive(options.meta)) {
                metaAsString = options.meta;
            } else if (options.meta instanceof Error && options.meta.stack) {
                metaAsString = util.inspect(options.meta.stack);
            }
            else {
                metaAsString = util.inspect(options.meta);
            }

            returnString = `${returnString} : ${metaAsString}`;
        }
        return returnString;
    }
};