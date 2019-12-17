const mongoose = require('mongoose');

const Schema = mongoose.Schema; // constructor

const orderSchema = new Schema({
  products: [
    {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true }
    }
  ],
  user: {
      name: {
          type: String,
          required: true
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // use name of model
        required: true
      }
  }
});

module.exports = mongoose.model('Order', orderSchema);
