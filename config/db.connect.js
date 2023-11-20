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
    return stringValue;
});

const db = pgp(process.env.DB_URI)
    .then(obj => {
        obj.done(); // success, release the connection;
        console.log('connexión success :D'.blue);
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
        console.log('Error try to connecting to the DataBase'.rainbow);
        process.exit(1);
    });

export default db;