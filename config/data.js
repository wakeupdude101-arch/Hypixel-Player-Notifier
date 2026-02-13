const mongoose = require('mongoose');
require('dotenv').config();

class data {
    constructor(){
        this.connection = null;

    }
    connect(){
        console.log('Connecting to database.....');

        mongoose.connect(process.env.MONGO_URI, {
        }).then(() => {
            console.log('Connected to database');
            this.connection = mongoose.connection;
        }).catch(err => {
            console.log(err);
        });
    }
}

module.exports = data;