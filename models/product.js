const fs = require('fs');
const path = require('path');

const getProductsFromFile = (callback) => {
    const p = path.join(
        path.dirname(process.mainModule.filename), // project file path
        'models',
        'data',
        'products.json'
    );
    fs.readFile(p, (err, fileContent) => {
        if (err || fileContent.byteLength === 0) {
            return callback([], p /*path*/); // use empty array if file is empty
        }
        callback(JSON.parse(fileContent), p /*path*/); // pass JSON "array of" objects and path to callback function.
    });
}

module.exports = class Product {
    constructor(title, imageURL, description, price) {
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price; // just add fields here.. everything is taken care of..
    }

    save() {
        this.id = Math.random().toString(); // not guaranteed to be unique, but close enough.
        getProductsFromFile((products,  // Array of products set up by getProductsFromFile
                             path) => { // Path set up by getProductsFromFile
            products.push(this); // Add "this product" to array.
            fs.writeFile(path, JSON.stringify(products), // make string '[{"title":"Book"},...'
                (err) => {
                    console.log(err);
                });
        });
    }

    // Static puts method on the class itself.
    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
};