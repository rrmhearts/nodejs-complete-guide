const path = require('path');
const fs = require('fs');

const p = path.join(
    path.dirname(process.mainModule.filename), // project file path
    'models',
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, price) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};

            if (!err && fileContent.byteLength !== 0) {
                cart = JSON.parse(fileContent);
            }

            // Analyze care => find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            // Add new product / increase quantity
            if (existingProduct) {
                // inrease quantity.
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                //cart.products = [...cart.products]; // why?
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                // add new product
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +price;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (err) {
                return;
            } else if (fileContent.byteLength !== 0) {
                cart = JSON.parse(fileContent);
            }

            const updatedCart = {...cart};
            const product = updatedCart.products.find(prod => prod.id === id);
            const productQty = product.qty;

            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = cart.totalPrice - price * productQty;
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }

    /* Always one cart.
    constructor() {
        this.products = [];
        this.totalPrice = 0;
    } */
}