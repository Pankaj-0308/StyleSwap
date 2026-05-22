const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  brand: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  points: { type: Number, default: 0 },
  mainImageUrl: { type: String },
  description: { type: String },
  tags: [{ type: String }],
  userId: { type: String, required: true },
  status: { type: String, default: 'active' },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

clothesSchema.statics.fetchAll = function() {
  return this.find();
};

clothesSchema.statics.findById = function(clothesId) {
  return this.findOne({ _id: clothesId });
};

clothesSchema.statics.findByUserId = function(userId) {
  return this.find({ userId: userId });
};

clothesSchema.statics.findByCategory = function(category) {
  return this.find({ category: category, status: 'active' });
};

clothesSchema.statics.findByStatus = function(status) {
  return this.find({ status: status });
};

clothesSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

clothesSchema.statics.updateStatus = function(clothesId, status) {
  return this.updateOne(
    { _id: clothesId },
    { 
      $set: { 
        status: status,
        updatedAt: new Date()
      }
    }
  );
};

clothesSchema.statics.incrementViews = function(clothesId) {
  return this.updateOne(
    { _id: clothesId },
    { $inc: { views: 1 } }
  );
};

clothesSchema.statics.deleteById = function(clothesId) {
  return this.deleteOne({ _id: clothesId });
};

clothesSchema.statics.deleteByUserId = function(userId) {
  return this.deleteMany({
    $or: [
      { userId: String(userId) },
      { userId: new mongoose.Types.ObjectId(String(userId)) }
    ]
  });
};

clothesSchema.statics.searchByTags = function(tags) {
  const tagArray = Array.isArray(tags) ? tags : [tags];
  return this.find({ 
    tags: { $in: tagArray },
    status: 'active'
  });
};

clothesSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        totalActive: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
        totalSold: { $sum: { $cond: [{ $eq: ["$status", "sold"] }, 1, 0] } },
        totalViews: { $sum: "$views" },
        avgPrice: { $avg: "$price" }
      }
    }
  ]);
};

const MongooseClothes = mongoose.model('Clothes', clothesSchema);

function Clothes(itemName, category, subcategory, size, condition, brand, color, price, points, mainImageUrl, description, tags, userId) {
  if (typeof itemName === 'object' && itemName !== null) {
    return new MongooseClothes(itemName);
  }
  
  const parsedTags = tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : [];

  const data = {
    itemName,
    category,
    subcategory,
    size,
    condition,
    brand,
    color,
    price: parseFloat(price),
    points: parseInt(points) || 0,
    mainImageUrl,
    description,
    tags: parsedTags,
    userId,
    status: 'active',
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return new MongooseClothes(data);
}

Object.setPrototypeOf(Clothes, MongooseClothes);
Clothes.prototype = MongooseClothes.prototype;

module.exports = Clothes;