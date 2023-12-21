const events = require('events');
const mysql  = require('mysql');

const GenericDatabase = require('./GenericDatabase.js');

class MySql extends GenericDatabase{

    static ERRORS = {

        ECONNREFUSED: 'A conexão foi recusada, verifique o usuário, senha, host e porta'

    }

    static log(message, priority){

        super.log('mysql', message, priority);

    }

    // static parseTableStructure(str){

    //     str = str.split(" ENGINE=")[0];
    
    //     str = str + ";";
    
    //     return str;
    
    // }

    // @test
    static getTableData(sql){

        let obj = {
            table: '',
            columns: {},
            indexes: []
        };

        let lines = sql.split("\n");

        lines.forEach((line, n) => {

            line = line.trim();

            if(n === 0){

                return obj.table = line.replace("CREATE TABLE `", "").replace("` (", "");

            }

            if(line == ");") return;

            let columns = line.split(' ');

            let columnName = columns[0].replace(/`/g, '');

            if(columnName === 'UNIQUE'){
                return obj.indexes.push(line);
            }

            obj.columns[columnName] = line.replace(',', '').replace(`\`${columnName}\` `, '');

        });

        return obj;

    }

    // static compareStructure(){

    //     let oldSqlPath = path.join(global.dir.doc, 'generated-files', 'structure.sql');
    
    //     fs.exists(oldSqlPath).then(exists => {
    
    //         if(!exists){
    
    //             console.log("Não há como compararmos o banco de dados se o arquivo doc/generated-files/structure.sql inexistir.");
    //             console.log("Use o comando " + 'backup structure'.green + ' para gera-lo.');
    
    //             return;
    
    //         }
    
    //         console.log('Bora morfar')
    
    //         fs.readFile(oldSqlPath, 'utf-8').then(oldSql => {
    
    //             let migrateSql = "";
    //             let createSql  = "";
    
    //             Database.backupStructure(newSql => {
    
    //                 let oldBase = Database.getBaseObj(oldSql);
    //                 let newBase = Database.getBaseObj(newSql);
    
    //                 Object.keys(oldBase).forEach((tableName, k) => {
    
    //                     if(typeof newBase[tableName] === 'undefined'){
    
    //                         console.log(`${tableName.red} não existe no banco novo.`);
    
    //                         createSql += oldBase[tableName].sql + "\n\n";
    
    //                     }
    
    //                 });
    
    //                 Object.keys(newBase).forEach((tableName, k) => {
    
    //                     if(typeof oldBase[tableName] === 'undefined'){
    
    //                         console.log(`${tableName.red} não existe no banco antigo.`);
    
    //                     } else{
    
    //                         var columnsFound = [];
    
    //                         Object.keys(newBase[tableName].columns).forEach(column => {
    
    //                             if(!columnsFound.includes(column)){
    //                                 columnsFound.push(column);
    //                             }
    
    //                         });
    
    //                         Object.keys(oldBase[tableName].columns).forEach(column => {
    
    //                             if(!columnsFound.includes(column)){
    //                                 columnsFound.push(column);
    //                             }
    
    //                         });
    
    //                         columnsFound.forEach(column => {
    
    //                             var oldColumn = oldBase[tableName].columns[column];
    //                             var newColumn = newBase[tableName].columns[column];
    
    //                             if(typeof oldColumn === 'undefined'){
    
    //                                 return console.log(`${tableName.magenta}.${column.green} não existe no banco antigo.`);
    
    //                             }
    
    //                             if(typeof newColumn === 'undefined'){
    
    //                                 migrateSql += `ALTER TABLE \`${tableName}\` ADD \`${column}\` ${oldColumn};\n`;
    
    //                                 return console.log(`${tableName.magenta}.${column.green} não existe no banco novo.`);
    
    //                             }
    
    //                             if(oldColumn != newColumn){
    
    //                                 migrateSql += `ALTER TABLE \`${tableName}\` CHANGE \`${column}\` \`${column}\` ${oldColumn};\n`;
    
    //                                 console.log(tableName.magenta + '.' + column.green + ' está diferente.');
    
    //                             }
    
    //                         });
    
    //                     }
    
    //                 });
    
    //                 if(migrateSql){
    
    //                     console.log('Para atualizar as colunas do banco atual com o do repositório:');
    //                     console.log(migrateSql);
    
    //                 }
    
    //                 if(createSql){
    
    //                     console.log('Para criar as tabelas no atual:');
    //                     console.log(createSql);
    
    //                 }
    
    //             });
    
    //         });
    
    //     });
    
    // }

    // static backupStructure(callback){

    //     return global.db.fetch("SHOW TABLES").then(tables => {
    
    //         let tableNames = [];
    //         let finalStructure = "-- Generated on " + new Date().toLocaleString() + "\n\n";
    
    //         tables.forEach(tableInDb => {
    
    //             tableNames.push(tableInDb[Object.keys(tableInDb)[0]]);
    
    //         });
    
    //         let showCreateTablesPromise = [];
    
    //         tableNames.forEach((table, k) => {
    
    //             showCreateTablesPromise.push(global.db.internalQuery("SHOW CREATE TABLE " + table).then(result => {
    
    //                 var tableStructure = Database.parseTableStructure(result['Create Table']);
    
    //                 var prefix = "\n\n";
    
    //                 if(k === 0) prefix = "";
    
    //                 finalStructure += prefix + tableStructure;
    
    //             }))
    
    //         });
    
    //         return Promise.all(showCreateTablesPromise).then(function(){
    
    //             if(typeof callback !== 'undefined'){
    
    //                 callback(finalStructure);
    
    //             } else{
                    
    //                 return fs.writeFile(path.join(global.dir.doc, 'generated-files', 'structure.sql'), finalStructure, 'utf-8').then(() => {
    
    //                     console.log('Backup realizado com sucesso');
    
    //                 });
    
    //             }
    
    
    //         });
    
    //     });
    
    // }

    // installGeneratedStructure(){

    //     let structurePath = path.join(global.dir.doc, 'generated-files', 'structure.sql');

    //     fs.exists(structurePath).then(exist => {

    //         if(!exist){

    //             return console.log('@warn Arquivo de estrutura de banco de dados inexistente');

    //         } else{

    //             console.log('@warn Criando estrutura de banco de dados');

    //             cp.exec(`mysql -h ${process.env.MYSQL_HOST} -u ${process.env.MYSQL_USER} -p${process.env.MYSQL_PASS} ${process.env.MYSQL_DB} < ${structurePath}`);

    //         }

    //     });

    // },

    // checkForStructureInstall(){

    //     global.db.con().then(con => {

    //         con.fetch("SHOW TABLES;").then(rows => {

    //             if(rows.length == 0){

    //                 Database.installGeneratedStructure();

    //             }

    //         });

    //     });

    // },

    static getBaseObj(sql){

        let obj = {};
    
        let reg = /CREATE\sTABLE \`[a-zA-Z_0-9]+\`\s\((.|\n)*?\);\n/g;
    
        let founds = sql.match(reg);
    
        founds.forEach((found, k) => {
    
            let tableSql = found.trim();
    
            let tableData = Database.util.getTableData(tableSql);
    
            tableData.sql = tableSql;
    
            obj[tableData.table] = tableData;
    
        });
    
        return obj;
    
    }

    constructor(config){

        super();

        let event = new events.EventEmitter();

        this.connected = false;

        if(!config.user)     throw new Error('MySql: User not defined');
        if(!config.database) throw new Error('MySql: Database not defined');

        if(!config.connectionLimit) config.connectionLimit = 25;

        this.pool = mysql.createPool({
            connectionLimit :  config.connectionLimit,
            host:     config.host || 'localhost',
            port:     config.port || 3306,
            user:     config.user,
            password: config.password || '',
            database: config.database,
            charset:  config.charset || 'utf8mb4'
        });

        this.client = mysql.createConnection({
            host:     config.host || 'localhost',
            port:     config.port || 3306,
            user:     config.user,
            password: config.password || '',
            database: config.database,
            charset:  config.charset || 'utf8mb4'
        });

        let mode = 'client';

        mode = 'pool';

        if(config.mode){

            mode = config.mode;

        }

        console.log('O mysql está usando o modo', mode, 'com no máximo', config.connectionLimit, 'conexões simultâneas');

        let connections = 0;
        let enqueues    = 0;

        this.pool.on('enqueue', function () {

            console.log('Aguardando conexão disponível no pool'.magenta);
            enqueues++;

        });

        this.pool.on('release', function () {

            // console.log('Conexão liberada do pool');
            connections--;

        });

        this.pool.on('acquire', function () {

            // console.log('Conexão adquirida do pool');
            connections++;
            // enqueues--;

        });

        this.pool.on('connection', function (connection) {

            // console.log('Nova conexão criada no pool');

        });

        if(mode == 'pool'){

            setInterval(() => {

                console.log('@mysql Conexões: '.green, this.pool._allConnections.length, '(' + connections + ')', 'de', config.connectionLimit, '(iddle: ' + this.pool._freeConnections.length + ', enqueues: ' + enqueues + ')');
    
            }, 5000);

        }

        this.defaultConnection = this[mode];

        this.stressTest = async () => {

            console.log("\n");
            // console.log("\n");
            console.log('@mysql Começando stress test'.red);
            // console.log("\n");
            // console.log("\n");

            const tables = await this.fetch("SHOW TABLES");

            // while(true) {

                // console.log('TRYINGGG');

                const table = tables[Math.floor(Math.random() * tables.length)]['Tables_in_' + config.database];

                const sql = `SELECT * FROM ${table}`;

                await this.fetch(sql).then(row => {

                    console.log('Rows', row.length);

                });

                console.log('Executado', sql);

            // }
            console.log('@mysql Conexões: '.green, this.pool._allConnections.length, '(' + connections + ')', 'de', config.connectionLimit, '(iddle: ' + this.pool._freeConnections.length + ', enqueues: ' + enqueues + ')');
          
        }

        if(mode == 'client'){

            this.defaultConnection.connect((err) => {

                if(err){
    
                    let stringError = err.toString()
    
                    if(stringError.includes('ECONNREFUSED')){
                        console.log(MySql.ERRORS.ECONNREFUSED);
                        event.emit('error', MySql.ERRORS.ECONNREFUSED);
                        return MySql.log(stringError);
                    }
    
                    // If no error is found, throw the error
                    throw err;
    
                }
    
                this.connected = true;
    
                setInterval(() => {
    
                    this.defaultConnection.query("SELECT 1")
                    
                }, 10000);
    
                MySql.log(`Connected at ${Date.now()}`);
    
                event.emit('connect');
    
            });
    
            this.defaultConnection.on('error', (err) => {
    
                if(err.code === 'PROTOCOL_CONNECTION_LOST'){
    
                    MySql.log('Database connection was closed.');
    
                    this.connected = false;
    
                    event.emit('disconnect');
    
                } else{
    
                    throw err;
    
                }
    
            });

        } else{

            this.connected = true;            
            
        }

        this.on = event.on.bind(event);

        return this;
        
    }
    
    // --------------------------------------------------

    checkVersion(version){

        let versionPath = path.join(global.dir.root, 'data', version);

        fs.exists(versionPath).then(exists => {

            if(!exists) return console.log(`Esse arquivo (data/${version}) não existe`);

            fs.readJson(versionPath, 'utf-8').then(versionData => {

                Object.keys(versionData.structure).forEach(function(table){

                    console.log(Database.util.keeperTableToSql(table, versionData.structure[table], versionData.structure));

                });

                // console.log("\n");

                // Database.backupStructure(newSql => {

                //     let newBase = Database.getBaseObj(newSql);

                //     console.log(newBase.users.columns)

                // });

                // console.log(versionData);

            });

        });

        console.log(version);

        return Promise.resolve('weeee');

    }

    keeperGetLineSql(columnName, line, obj){

        let sql   = "";
        let index = "";

        let type = line.type || line;
        let length = null;
        let isnull = null;

        // Usado apenas quando o tipo for um array, classificando um enum
        let enumVals = [];

        let unique     = false || line.unique;
        let defaultVal = false || line.default;

        let fromAnotherTable = false;

        // Aqui estamos processando primeiro as colunas de outras tabelas, como companies.id
        // É importante que esteja antes, para que o próprio sistema interprete o tipo das
        // colunas dessas tabelas que não estão nessa linha(por serem de outra tabela)
        if(typeof line === 'string' && line.split('.').length > 1){

            let table = line.split('.')[0];
            let col   = line.split('.')[1];

            if(obj && obj[table] && obj[table][col]){

                type = obj[table][col];
                fromAnotherTable = true;

            }

        }

        // Caso seja um objeto com tamanho definido(array)
        if(typeof type === 'object' && type.length){

            enumVals = type;
            type = 'enum';

        } else{

            let typeSplit = type.split(' ');

            // Aqui é possível tentar identifica as características, quando existe maisde uma palavra
            // na linha da coluna, por exemplo: varchar 15 null
            if(typeSplit.length > 1){

                switch(typeSplit.length){
                    case 1:

                        type = typeSplit[0];

                    break;
                    case 2:

                        type   = typeSplit[0];
                        length = typeSplit[1];

                    break;
                    case 3:

                        type   = typeSplit[0];
                        length = typeSplit[1];
                        isnull = typeSplit[2];

                    break;
                }

            }

        }

        if(columnName === '@description'){

            type = 'meta';

        }

        switch(type){
            case 'enum':

                let vals = [];

                enumVals.forEach(enumVal => {

                    vals.push(`'${enumVal}'`);

                });

                sql += `enum(${vals.join(', ')}) NOT NULL`;

            break;
            case 'serial':

                sql += "bigint(20) unsigned NOT NULL";

                if(!fromAnotherTable){
                    sql += " AUTO_INCREMENT";
                    unique = true;
                }

            break;
            case 'boolean':

                sql += "bool";

                if(defaultVal){

                    sql += " default ";

                    if(typeof defaultVal == 'string'){

                        sql += `'${defaultVal}'`;

                    } else{

                        sql += `${defaultVal}`;

                    }

                }

            break;
            case 'varchar':
            case 'email':
            case 'bcrypt':

                if(length === null){

                    length = 128;

                }

                sql += `varchar(${length})`;

                if(isnull === '!null'){

                    sql += " NOT NULL";

                }

                if(defaultVal){

                    sql += " default ";

                    if(typeof defaultVal == 'string'){

                        sql += `'${defaultVal}'`;

                    } else{

                        sql += `${defaultVal}`;

                    }

                }

            break;
            case 'unixtime':

                sql += "bigint unsigned not null";

                if(defaultVal){

                    sql += " default ";

                    if(typeof defaultVal == 'string'){

                        sql += `'${defaultVal}'`;

                    } else{

                        sql += `${defaultVal}`;

                    }

                }

            break;
            case 'meta':

                // @description

            break;
            default:

                console.log('sushi', columnName, 'sushi');

                console.log('Tipo não encontrado: tabela', columnName, line, '->', type);

            break;
        }

        if(unique){

            index = `\tUNIQUE KEY \`${columnName}\` (\`${columnName}\`),`;

        }

        return {
            sql: sql,
            index: index
        };

    }

    keeperTableToSql(table, columns, obj){

        let sql     = `CREATE TABLE \`${table}\` (\n`;
        let indexes = "";

        Object.keys(columns).forEach(column => {

            let line    = columns[column];
            let type    = line.type || line;
            let lineSql = Database.util.keeperGetLineSql(column, line, obj);

            if(lineSql.sql){
                
                sql += "\t" + column + " " + lineSql.sql + ",\n";

                if(lineSql.index){

                    indexes += lineSql.index + "\n";

                }

            }

        });

        if(indexes){

            sql += indexes;

        }

        sql += "\n);"

        sql = sql.replace(/\,\n+\n\);/g, '\n);');

        return sql;

    }

    get con (){

        return new Promise((resolve, reject) => {

            this.pool.getConnection((err, connection) => {

                if(err) return reject(err);

                resolve(connection);

            });

        });

    }

    get poolConnection(){

        return this.con.then(con => {
    
            con.fetch = (sql, prepared = []) => {
    
                return this.fetch(sql, prepared, con);
    
            }
    
            con.read = (sql, prepared = []) => {
    
                return this.read(sql, prepared, con);
    
            }
    
            con.write = (sql, prepared = []) => {
    
                return this.write(sql, prepared, con);
    
            }
    
            return con;
            
        });

    }

    async fetch(sql, prepared = [], con = null){

        if(!con) con = this.defaultConnection;

        if(process.env.VERBOSE == 'true') console.log("\n" + '@mysql Fetch-> '.red, sql, prepared, "\n");

        return new Promise((resolve, reject) => {

            if(!this.connected) return reject("@MySql Not connected");

            con.query(sql, prepared, (err, answer) => {

                if(err){

                    MySql.log(err);

                    return reject(err);

                }
                
                resolve(answer);

            });

        });

    }

    read(sql, prepared = [], con = null){

        if(!con) con = this.defaultConnection;

        if(process.env.VERBOSE == 'true') console.log("\n" + '@mysql Fetch-> '.red, sql, prepared, "\n");

        return new Promise((resolve, reject) => {

            if(!this.connected) return reject("@MySql Not connected");

            con.query(sql, prepared, (err, answer) => {

                if(err){

                    MySql.log(err);

                    return reject(err);

                }
                
                resolve(answer[0]);

            });

        });

    }

    async write(sql, prepared = [], con = null){

        if(!con) con = this.defaultConnection;

        if(process.env.VERBOSE == 'true') console.log("\n" + '@mysql Write-> '.red, sql, prepared, "\n");

        return new Promise((resolve, reject) => {

            if(!this.connected) return reject("@MySql Not connected");

            con.query(sql, prepared, (err, answer) => {

                if(err){

                    MySql.log(err);

                    return reject(err);

                }
                
                resolve(answer);

            });

        });

    }
    
}

module.exports = MySql;