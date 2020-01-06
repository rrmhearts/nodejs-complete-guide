
const mongoose = require('mongoose');

const Schema = mongoose.Schema; // constructor

const userSchema = new Schema({
  /*
  name: {
    type: String,
    required: true // enforcing schema!
  },
  */
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true // enforcing schema!
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
      }
    ]
  },
});

// Must use function to maintain "this", will be called on instance
userSchema.methods.addToCart = function(product) {

    // Array method, iterate through array, return index of found item.
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0)
    {
        // Product already in cart
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }

    const updatedCart = { 
        items: updatedCartItems
    };
    this.cart = updatedCart;

    return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = function(productId) {
    this.cart = {items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);
