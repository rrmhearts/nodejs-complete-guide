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

          // Clean Up cart if item was deleted!
          if (productIds.length !== products.length)
          {
            const cleanUp = productIds.filter(id => 
              !products.map(p => {
                return p._id.toString()
              })
              .includes(id.toString()) // must be toString.
            );
            cleanUp.forEach(id => this.deleteItemFromCart(new mongodb.ObjectId(id)) );
          }

          return products.map(p => { // iterate through array
              return {
                  ...p, // product data
                  quantity: this.cart.items.find(item => { // Array method
                      return item.productId.toString() === p._id.toString();
                  }).quantity
              }
          });
        });
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

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db
      .collection('users')
      .updateOne(/* Search for    */
        {_id: this._id}, 
                 /* How to Update */
        {$set: {cart: {items: updatedCartItems}}}
      );
  }

  addOrder() {
    // Orders gets longer than a cart. Start new table.
    const db = getDb();

    // Will get product information too!
    return this.getCart().then(products => {
      const order = {
        items: products,
        user: {
          _id: new mongodb.ObjectId(this._id),
          name: this.name,
          email: this.email
        }
      };
      return db.collection('orders').insertOne(order)
    })
    .then(() => { // then clear cart.
      this.cart = {items: []};
      return db
        .collection('users')
        .updateOne( /*clear cart*/
          {_id: new mongodb.ObjectId(this._id)}, 
          {$set: {cart: this.cart}}
         );
    });
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders')
      .find({ // user is an object in an order.
        'user._id': new mongodb.ObjectId(this._id /*user*/ )
      })
      .toArray()
      .then(products => {
        return products;
      });
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
