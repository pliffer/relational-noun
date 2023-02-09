const fs = require('fs-extra');

const Util = require('../util');

let logPath = process.cwd() + '/.logs';

class GenericDatabase{

    constructor(){}

    static log(type, message, priority){

        if(typeof priority == 'undefined') priority = 0;

        let log = {
            type: type,
            message: message,
            priority: priority,
            date: new Date().getTime()
        };

        if(!priority) delete log.priority;

        let dayPath = Util.dayPath(logPath);

        fs.ensureDirSync(dayPath);

        fs.appendFile(dayPath + '/' + type + '.log', JSON.stringify(log) + "\n", (err) => {

            if(err) throw err;

        });

    }

}

module.exports = GenericDatabase;