const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbConnection;
const dbURI = process.env.dbURI

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(dbURI)
            .then(client => {
                dbConnection = client.db();
                return cb();
            })
            .catch( err => {
                console.log(err);
                cb(err);
            })
    },
    getDb: () => dbConnection
};