const events = require('events');

const GenericDatabase = require('./GenericDatabase.js');

class SQLite extends GenericDatabase{

// 	db: null,
// 	databaseName: null,

// 	fetch:function(sql, callback){

// 		var rows = [];
// 		var aux  = [];
// 		var err  = false;

// 		try{
// 			aux = this.db.exec(sql);
// 		} catch(e){
// 			err = e;
// 		}

// 		if(!err && aux!=false){
// 			aux = aux[0];
// 			aux.values.foreach(function(value, n){
// 				rows[n] = {}
// 				Object.keys(value).forEach(function(j){
// 					rows[n][[aux.columns[j]]] = value[j];
// 				});
// 			});
// 		}

// 		callback(err, rows);
// 		if(new Date().getSeconds()%20>=14) this.save_backup();
// 	},

// 	rawFetch:function(sql, callback){

// 		var rows = [];
// 		var aux  = [];
// 		var sub_aux = [];
// 		var err  = false;

// 		try{
// 			aux = this.db.exec(sql);
// 		} catch(e){
// 			err = e;
// 		}
		
// 		if(!err && aux!=false){
// 			aux.foreach(function(iquery, ik){
// 				rows[ik] = [];
// 				iquery.values.foreach(function(value, vk){
// 					rows[ik][vk] = {}
// 					Object.keys(value).forEach(function(j){
// 						rows[ik][vk][[iquery.columns[j]]] = value[j];
// 					});
// 				});
// 			});
// 		}

// 		callback(err, rows);
// 		if(new Date().getSeconds()%20>=14) this.save_backup();
// 	},

// 	raw: function(sql, callback){

// 		var rows = [];
// 		var err  = false;

// 		try{
// 			rows = this.db.exec(sql);
// 		} catch(e){
// 			err = e;
// 		}

// 		callback(err, rows);
		
// 	},

// 	save_backup: function(){
// 		this.salvar(ROOT + "/access/data/backups/backup-" + this.databaseName + "-" + getTime() + ".db");
// 	},

// 	query: function(sql, callback){

// 		var rows = [];
// 		var aux  = [];
// 		var err  = false;

// 		try{
// 			aux = this.db.exec(sql);
// 		} catch(e){
// 			err = e;
// 			console.log(sql);
// 		}

// 		if(!err && aux!=false){
// 			aux = aux[0];
// 			aux.values.forEach(function(value, n){
// 				rows[n] = {}
// 				Object.keys(value).forEach(function(j){
// 					rows[n][[aux.columns[j]]] = value[j];
// 				});
// 			});
// 		}

// 		callback(err, (rows.length>0?rows[0]:rows));
// 		if(new Date().getSeconds()%20>=14) this.save_backup();

// 	},

// 	salvar: function(src){
// 		var data = this.db.export();
// 		return fs.writeFileSync(src, new Buffer(data));
// 	},

// 	close: function(){
// 		this.salvar(ROOT + "/access/data/" + this.databaseName + ".db");
// 		console.log("Banco de dados salvo! (".green + this.databaseName.red + ".db".red + ")".green);
// 	}
}

module.exports = SQLite;


// /*v14.8.2016*/

// var fs  = require('fs');

// Object.prototype.foreach = function(func){
// 	for(var i=0;i<this.length;i++) func(this[i],i);
// }

// var sql = require('sql.js');

// // @TODO Save backup
// // @TODO Mais comentarios
// // @TODO Remover palavras CREATE, INSERT, DELETE, DROP e UPDATE 
// // das readQuerys

// var base_database = {

// 	db: null,
// 	database_name: null,

// 	fetch:function(sql, callback){

// 		var rows = [];
// 		var aux  = [];
// 		var err  = false;

// 		try{
// 			aux = this.db.exec(sql);
// 		} catch(e){
// 			err = e;
// 		}

// 		if(!err && aux!=false){

// 			// @TODO Suporte para multiplas querys
// 			aux = aux[0];

// 			aux.values.foreach(function(value, n){
// 				rows[n] = {}
// 				Object.keys(value).forEach(function(j){
// 					rows[n][[aux.columns[j]]] = value[j];
// 				});
// 			});
// 		}

// 		callback(err, rows);
// 	},

// 	// @TODO: Opção de delay, salvar ao mesmo momento de updateQuery
// 	// pode causar instabilidade e lentidão

// 	updateQuery: function(sql, callback, save){
// 		if(typeof save == 'undefined') save = true;
// 		var err  = false;

// 		try{
// 			this.db.exec(sql);
// 		} catch(e){
// 			err = e;
// 		}

// 		callback(err);
// 		if(!err && save) this.save();
// 	},

// 	rawReadQuery: function(sql, callback){

// 		var rows = [];
// 		var err  = false;

// 		try{
// 			rows = this.db.exec(sql);
// 		} catch(e){
// 			err = e;
// 		}

// 		callback(err, rows);
		
// 	},

// 	query: function(sql, callback){
// 		this.readQuery(sql, callback);
// 	},

// 	readQuery: function(sql, callback){

// 		var rows = [];
// 		var aux  = [];
// 		var err  = false;


// 		try{
// 			aux = this.db.exec(sql);
// 		} catch(e){
// 			err = e;
// 			console.log(err);
// 		}


// 		if(!err && aux!=false){
// 			aux = aux[0];
// 			aux.values.forEach(function(value, n){
// 				rows[n] = {}
// 				Object.keys(value).forEach(function(j){
// 					rows[n][[aux.columns[j]]] = value[j];
// 				});
// 			});
// 		}
		

// 		callback(err, (rows.length>0?rows[0]:rows));
// 	},

// 	save: function(src, callback){

// 		if(typeof src == 'undefined') src = DATA_DIRECTORY + this.database_name;
// 		if(typeof callback == 'undefined') callback = function(){};

// 		var data = this.db.export();
// 		fs.writeFileSync(src, new Buffer(data));

// 		callback();
// 	}
// }

// module.exports = function(database_name){

// 	if(typeof Memory.databases     == 'undefined') Memory.databases = {};
// 	if(typeof database_name == 'undefined') return console.log("database_name not defined");

// 	if(typeof Memory.databases[database_name] == 'undefined'){
// 		var file_buffer = fs.readFileSync(DATA_DIRECTORY + database_name);

// 		var db       = new sql.Database(file_buffer);
// 		var database = Object.create(base_database);

// 		database.db            = db;
// 		database.database_name = database_name;

// 		Memory.databases[database_name] = database;
// 	}

// 	return Memory.databases[database_name];

// }