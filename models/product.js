const mongoose = require('mongoose');

const Schema = mongoose.Schema; // constructor

const productSchema = new Schema({
  title: {
    type: String,
    required: true // enforcing schema!
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // use name of model
    required: true
  }
});

// create "products" collection
module.exports = mongoose.model('Product', productSchema);
