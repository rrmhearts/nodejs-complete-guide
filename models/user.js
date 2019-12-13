const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
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
