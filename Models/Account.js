const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  points: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

accountSchema.statics.fetchAll = function() {
  return this.find().sort({ createdAt: -1 });
};

accountSchema.statics.countAll = function() {
  return this.countDocuments();
};

accountSchema.statics.findById = function(accountId) {
  return this.findOne({ _id: accountId });
};

accountSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: String(email || '').trim().toLowerCase() });
};

accountSchema.statics.findFirstAccount = function() {
  return this.findOne().sort({ createdAt: 1, _id: 1 });
};

accountSchema.statics.updatePassword = function(accountId, passwordHash) {
  return this.updateOne({ _id: accountId }, { $set: { password: passwordHash } });
};

accountSchema.statics.updateRole = function(accountId, role) {
  return this.updateOne({ _id: accountId }, { $set: { role } });
};

accountSchema.statics.updatePoints = function(accountId, points) {
  return this.updateOne({ _id: accountId }, { $set: { points } });
};

accountSchema.statics.addPoints = function(accountId, pointsToAdd) {
  return this.updateOne({ _id: accountId }, { $inc: { points: pointsToAdd } });
};

accountSchema.statics.subtractPoints = function(accountId, pointsToSubtract) {
  return this.updateOne({ _id: accountId }, { $inc: { points: -pointsToSubtract } });
};

accountSchema.statics.deleteById = function(accountId) {
  return this.deleteOne({ _id: accountId });
};

const MongooseAccount = mongoose.model('Account', accountSchema);

function UserAccount(firstname, lastname, email, phone, password, role = 'user', points = 100, createdAt = new Date(), id = null) {
  if (typeof firstname === 'object' && firstname !== null) {
    return new MongooseAccount(firstname);
  }
  const data = {
    firstname,
    lastname,
    email: String(email || '').trim().toLowerCase(),
    phone,
    password,
    role,
    points,
    createdAt
  };
  if (id) {
    data._id = id;
  }
  return new MongooseAccount(data);
}

Object.setPrototypeOf(UserAccount, MongooseAccount);
UserAccount.prototype = MongooseAccount.prototype;

module.exports = UserAccount;
