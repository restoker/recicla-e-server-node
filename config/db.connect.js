import pgPromise from 'pg-promise';
import promise from 'bluebird';
import dotenv from 'dotenv';

const { config } = dotenv;
config();

const options = {
    promiseLib: promise,
    query: (e) => { }
}

const pgp = pgPromise(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function (stringValue) {
    console.log(stringValue);
    return stringValue;
});

const db = pgp({ connectionString: process.env.DB_URI, max: 30 })
db.connect()
    .then(obj => {
        obj.done(); // success, release the connection;
        console.log('connexión exitosa a la base de datos'.blue);
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
        console.log('Error al conectar la base de datos'.rainbow);
        process.exit(1);
    });

export default db;