const products = [];

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        products.push(this);
    }

    // Static puts method on the class itself.
    static fetchAll() {
        return products;
    }
}