const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  picture: {
    type: String,  // This can store the URL or path to the image file
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,  // Refers to the User model
    ref: 'User',
    required: true
  },
  ratings: {
    type: Number,  // Optional rating field
    min: 0,
    max: 5
  },
  reviews: [{
    type: String  // Optional reviews, stored as an array of strings
  }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
