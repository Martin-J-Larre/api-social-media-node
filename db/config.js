const mongoose = require('mongoose');

const connection = () => { 
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.URI_MONGO);
    console.log('DATABASE CONNECTED');
  } catch (err) {
    console.log(err);
    throw new Error('DATABASE NOT CONNECTED');
  }
}

module.exports = connection;
