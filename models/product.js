const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, /*optional*/id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? mongodb.ObjectId(id) : null;
  }

  /*
    Save a product into MongoDB.
  */
  save() {

    const db = getDb();

    let dbOperation;
    if (this._id) {
      // UPDATE product
      dbOperation = db.collection('products')
        .updateOne(/* Search for    */ {_id: this._id}, 
                   /* How to Update */ {$set: this});
    } else {
      // NEW poduct
      dbOperation = db.collection('products')
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

  /*
    Retrieve all products from MongoDB.
  */
  static fetchAll() {
    const db = getDb();
    return db
      .collection('products') //mongo db things.
      .find() // find all products.
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  /*
    Find a product in MongoDB by id value.
  */
  static findById(prodId) {
    const db = getDb();
    return db.collection('products')
    /* 
     * prodId is not the same thing as ObjectId in MongoDB 
     * prodId is retrieved from MongoDB through fetchAll in controller/shop.js
     * The link to details page contains prodId from Mongo (a string),
     * when clicked, we findById which comes here. You have to find by ObjectId,
     * not the string prodId. Creates comparable ObjectId when finding.
     */
      .find({_id: new mongodb.ObjectId(prodId)})
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {console.log(err)});
  }

  static deleteById(prodId) {
    const db = getDb();
    return db.collection('products')
    .deleteOne({_id: new mongodb.ObjectId(prodId)})
    .then(() => {
      console.log('Deleted: ' + prodId);
    })
    .catch(() => {
      console.log(err);
    })
  }
}
module.exports = Product;
