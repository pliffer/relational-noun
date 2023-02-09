const events = require('events');
const pg     = require('pg');

const GenericDatabase = require('./GenericDatabase.js');

class Postgres extends GenericDatabase{

    static ERRORS = {

        ECONNREFUSED: 'A conexão foi recusada, verifique o usuário, senha, host e porta'

    }

    static log(message, priority){

        super.log('postgres', message, priority);

    }

    constructor(config){

        super();

        let event = new events.EventEmitter();

        let configString = config;

        if(!typeof config == 'string'){

            if(!config.host)     config.host = 'localhost';
            if(!config.port)     config.port = 5432;
            if(!config.password) config.password = '';

            if(!config.user)     throw new Error('Postgres: User not defined');
            if(!config.database) throw new Error('Postgres: Database not defined');

            configString = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;

        }

        this.client = new pg.Client(configString);

        this.connected = false;

        this.client.connect((err) => {

            if(err){

                let stringError = err.toString()

                if(stringError.includes('ECONNREFUSED')){

                    console.log(Postgres.ERRORS.ECONNREFUSED);

                    event.emit('error', Postgres.ERRORS.ECONNREFUSED);

                    return Postgres.log(stringError);

                }
    
                // If no error is found, throw the error
                throw err;

            }

            this.connected = true;

            Postgres.log(`Connected at ${Date.now()}`);
            event.emit('connect');

        });

        this.on = event.on.bind(event);

        return this;
        
    }

    fetch(sql, prepared = []){

        return new Promise((resolve, reject) => {

            if(!this.connected) return reject("@Postgres Not connected");

            this.client.query(sql, prepared, function(err, answer){

                if(err){

                    Postgres.log({
                        sql,
                        err: err.toString()
                    });

                    return reject(err);
                }

                resolve(answer.rows);

            });
        });

    }

    read(sql, prepared = []){

        return new Promise((resolve, reject) => {

            if(!this.connected) return reject("@Postgres Not connected");

            client.query(sql, prepared, function(err, answer){

                if(err){

                    Postgres.log({
                        sql,
                        err: err.toString()
                    });

                    return reject(err);
                }
                
                resolve(answer.rows[0]);

            });

        });

    }

    
}

module.exports = Postgres;