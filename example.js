let Postgres = require('./databases/postgres.js');
let MySql    = require('./databases/mysql.js');

let postgres = new Postgres({
    database: 'central',
    user: 'postgres',
    password: 'postgres'
});

let mysql = new MySql({
    user: 'corp',
    password: 'pass',
    database: 'corp2'
});

let connections = [];

connections.push(new Promise(resolve => postgres.on('connect', resolve)));
connections.push(new Promise(resolve => mysql.on('connect', resolve)));

Promise.all(connections).then(async () => {

    let users = await postgres.fetch("SELECT * FROM mail");

    // let users2 = await mysql.fetch("SELECT * FROM representatives");

    console.log(users);


});
//     let users = await postgres.fetch("SELECT * FROM users");

//     console.log(users);

// });

// mysql.on('connect', () => {

//     console.log("Connected to postgres2");

// });
