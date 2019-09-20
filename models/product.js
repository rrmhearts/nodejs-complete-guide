
const db = require('../util/database');

const Cart = require('./cart');


module.exports = class Product {
    constructor(id, title, imageURL, description, price) {
        this.id = id;
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price; // just add fields here.. everything is taken care of..
    }

    /* Used for Add New and Edit */
    save() {
        return db.execute('INSERT INTO products (title, price, imageURL, description) '  + 
                   'VALUES (?, ?, ?, ?)', [this.title, this.price, this.imageURL, this.description]
                   ); // Library will escape strings when inserting into mysql.
    }

    static delete(id) {

    }

    // Static puts method on the class itself.
    static fetchAll() {
        return db.execute('SELECT * FROM products')
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }


};