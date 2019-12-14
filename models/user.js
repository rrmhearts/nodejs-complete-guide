const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this._id = id ? mongodb.ObjectId(id) : null;;
    this.name = username;
    this.email = email;
    this.cart = cart; // {item: []}
  }

  save() {

    const db = getDb();

    let dbOperation;
    if (this._id) {
      // UPDATE product
      dbOperation = db.collection('users')
        .updateOne(/* Search for    */ {_id: this._id}, 
                   /* How to Update */ {$set: this});
    } else {
      // NEW poduct
      dbOperation = db.collection('users')
      .insertOne(this)
    }
    return dbOperation
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // By user, not static.
  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(cp => {
        return cp.productId;
    });
    return db.collection('products')
    /* Find products in the cart! */
        .find({_id: {$in: productIds} })
        .toArray() /* mongodb command, cursor to array
            https://docs.mongodb.com/manual/reference/method/cursor.toArray/ */
        .then(products => {
            return products.map(p => { // iterate through array
                return {
                    ...p, // product data
                    quantity: this.cart.items.find(item => { // Array method
                        return item.productId.toString() === p._id.toString();
                    }).quantity
                }
            });
        })
  }

  // By user, not static.
  addToCart(product) {

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
            productId: new mongodb.ObjectId(product._id),
            quantity: newQuantity
        });
    }

    const updatedCart = { 
        items: updatedCartItems
    };
    const db = getDb();
    return db
        .collection('users')
        .updateOne(
            {_id: this._id},
            {$set: {cart: updatedCart} }
        );
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
    /* findOne returns one document */
      .findOne({_id: new mongodb.ObjectId(userId)})
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {console.log(err)});
  }
}

module.exports = User;
