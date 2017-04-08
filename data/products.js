const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
const uuid = require('node-uuid');

let exportedMethods = {
	getProductbyUPC(upc) {
        return products().then((productCollection) => {
            return productCollection.findOne({upc: upc}).then((product) => {
                if (!product) throw "product not found";
                return product;
            });
        });
    },
    //TODO: Enforce uniqueness of upc
	addProduct(upc, product_name, product_picture) {
        return products().then((productCollection) => {
            let newProduct = {
                upc: upc,
                product_name: product_name,
                product_picture: product_picture
            };

            return productCollection.insertOne(newProduct).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getProductbyUPC(newId);
            });
        });
    },
    removeProduct(upc) {
        return products().then((productCollection) => {
            return productCollection.removeOne({upc: upc}).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete product with upc of ${upc}`)
                }
            });
        });
    },
    updateProduct(upc, updatedProduct) {
        return this.getProductbyUPC(upc).then((currentUser) => {
            let updatedProductData = {};
            if(updatedProduct.product_name) updatedProductData.product_name = updatedProduct.product_name;
            if(updatedProduct.product_picture) updatedProductData.product_picture = updatedProduct.product_picture;

            let updateCommand = { 
                $set: updatedProduct
            };
            return productCollection.updateOne({upc: upc}, updateCommand).then(() => {
                return this.getProductbyUPC(upc);
            });
        });
    },
}

module.exports = exportedMethods;