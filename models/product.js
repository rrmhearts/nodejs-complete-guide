const fs = require('fs');
const path = require('path');

const getProductsFromFile = (callback) => {
    const p = path.join(
        path.dirname(process.mainModule.filename),
        'models',
        'data',
        'products.json'
    );
    fs.readFile(p, (err, fileContent) => {
        if (err || fileContent.byteLength === 0) {
            return callback([], p /*path*/);
        }
        callback(JSON.parse(fileContent), p /*path*/);
    });
}

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile((products, path) => {
            products.push(this);
            fs.writeFile(path, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    // Static puts method on the class itself.
    static fetchAll(callback) {
        getProductsFromFile(callback);

    }
};