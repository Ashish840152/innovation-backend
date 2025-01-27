const mongoose = require('mongoose');

const connection = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb://127.0.0.1:27017/machineTest', { useNewUrlParser: true });
    console.log('connected');
  } catch (err) {
    console.log(err);
  }
};

module.exports = connection;