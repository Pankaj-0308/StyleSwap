const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true },
  message: { type: String }
});

feedbackSchema.statics.fetchAll = function() {
  return this.find();
};

const MongooseFeedback = mongoose.model('Feedback', feedbackSchema);

function UserFeedback(name, email, rating, message) {
  if (typeof name === 'object' && name !== null) {
    return new MongooseFeedback(name);
  }
  const data = {
    name,
    email,
    rating: parseInt(rating),
    message
  };
  return new MongooseFeedback(data);
}

Object.setPrototypeOf(UserFeedback, MongooseFeedback);
UserFeedback.prototype = MongooseFeedback.prototype;

module.exports = UserFeedback;