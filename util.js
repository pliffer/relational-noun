let path = require('path');

let Util = {

    months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],

    dayPath(prefix){
   
        var date = new Date();

        var year = date.getFullYear().toString();
        var day  = date.getDate().toString();

        return path.join(prefix, year, Util.months[date.getMonth()], day);

    }

}

module.exports = Util;