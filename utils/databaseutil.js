const mongoose = require('mongoose');

const url = process.env.MONGODB_URI || `mongodb+srv://rajansingh8593:rajan123@captanjack.rr7lw.mongodb.net/odoo?retryWrites=true&w=majority&appName=Captanjack`;

const mongoConnect = (callback) => {
  mongoose.connect(url)
  .then(() => {
    console.log("connected to mongodb via mongoose");
    callback();
  })
  .catch((error) => {
    console.log("error while connecting database", error);
  });
};

const getDB = () => {
  if (!mongoose.connection || !mongoose.connection.db) {
    throw new Error('mongo/mongoose not connected');
  }
  return mongoose.connection.db;
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;