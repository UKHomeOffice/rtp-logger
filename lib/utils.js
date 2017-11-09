var util = require('util');

module.exports = {
    timestamp: function() {
        return new Date().toISOString()
    },
    formatter: function(options) {
        var metaAsString;
        var returnString =  `[${options.label}] [${options.level}] ${options.timestamp()} ${options.message}`;

        if(options.meta) {

            if (util.isPrimitive(options.meta)) {
                metaAsString = options.meta;
            } else if (options.meta instanceof Error && options.meta.stack) {
                metaAsString = util.inspect(options.meta.stack);
            } else if (Object.keys(options.meta).length == 0){
                metaAsString = '';
            } else {
                metaAsString = util.inspect(options.meta);
            }

            if (metaAsString.length > 0){
                returnString = `${returnString} : ${metaAsString}`;
            }
        }
        return returnString;
    }
};