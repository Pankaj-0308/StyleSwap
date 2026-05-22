const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
  buyerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  clothesId: { type: String, required: true },
  points: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

purchaseRequestSchema.statics.fetchAll = function() {
  return this.find();
};

purchaseRequestSchema.statics.findById = function(requestId) {
  return this.findOne({ _id: requestId });
};

purchaseRequestSchema.statics.findByBuyerId = function(buyerId) {
  return this.find({ buyerId: buyerId });
};

purchaseRequestSchema.statics.findBySellerId = function(sellerId) {
  return this.find({ sellerId: sellerId });
};

purchaseRequestSchema.statics.findBySellerIdAndStatus = function(sellerId, status) {
  return this.find({ sellerId: sellerId, status: status });
};

purchaseRequestSchema.statics.findByClothesId = function(clothesId) {
  return this.find({ clothesId: clothesId });
};

purchaseRequestSchema.statics.updateStatus = function(requestId, status) {
  return this.updateOne(
    { _id: requestId },
    { $set: { status: status } }
  );
};

purchaseRequestSchema.statics.deleteById = function(requestId) {
  return this.deleteOne({ _id: requestId });
};

purchaseRequestSchema.statics.deleteByClothesId = function(clothesId) {
  return this.deleteMany({ clothesId: String(clothesId) });
};

const MongoosePurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema);

function PurchaseRequest(buyerId, sellerId, clothesId, points, status = 'pending', createdAt = new Date(), id = null) {
  if (typeof buyerId === 'object' && buyerId !== null) {
    return new MongoosePurchaseRequest(buyerId);
  }
  const data = {
    buyerId,
    sellerId,
    clothesId,
    points,
    status,
    createdAt
  };
  if (id) {
    data._id = id;
  }
  return new MongoosePurchaseRequest(data);
}

Object.setPrototypeOf(PurchaseRequest, MongoosePurchaseRequest);
PurchaseRequest.prototype = MongoosePurchaseRequest.prototype;

module.exports = PurchaseRequest;
