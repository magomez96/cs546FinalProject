const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
const uuid = require('node-uuid');

let exportedMethods = {
    /*Get product given upc and return that product if successful
    */
    getProductbyUPC(upc) {
        return new Promise((fulfill, reject) => {
            return products().then((productCollection) => {
                return productCollection.findOne({
                    _id: upc
                }).then((product) => {
                    if (!product) reject("product not found");
                    fulfill(product);
                });
            });
        });
    },
    /*Get all products for "store" page display
    */
    getAllProducts() {
        return new Promise((fulfill, reject) => {
            return products().then((productCollection) => {
                fulfill(productCollection.find().toArray());
            });
        });
    },
    /*Add new product given upc, name and picture link
     *Handles duplicate upcs by ignoring them
    */
    addProduct(upc, product_name, product_picture) {
        return new Promise((fulfill, reject) => {
            return this.getProductbyUPC(upc).then((productRet) => {
                reject("Duplicate UPC detected")
            }).catch(function(reason){
                  return products().then((productCollection) => {
                    let newProduct = {
                        _id: upc,
                        product_name: product_name,
                        product_picture: product_picture
                    };
                    return productCollection.insertOne(newProduct).then((newInsertInformation) => {
                        return newInsertInformation.insertedId;
                    }).then((newId) => {
                        return productCollection.findOne({
                            _id: newId
                        }).then((product) => {
                            if (!product) reject("product not found");
                            fulfill(product);
                        });
                    });
                });
            });
        });
    },
    /*Add new product given upc, name and picture link
     *Does not hanlde duplicate upcs, used only for seed
    */
    addProductInit(upc, product_name, product_picture) {
        return new Promise((fulfill, reject) => {
            return products().then((productCollection) => {
                let newProduct = {
                    _id: upc,
                    product_name: product_name,
                    product_picture: product_picture
                };
                return productCollection.insertOne(newProduct).then((newInsertInformation) => {
                    return newInsertInformation.insertedId;
                }).then((newId) => {
                    fulfill(this.getProductbyUPC(newId));
                });
            });    

        });
    },
    /*Remove product given its upc
    */
    removeProduct(upc) {
        return new Promise((fulfill, reject) => {
            return products().then((productCollection) => {
                productCollection.removeOne({ _id: upc }).then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        reject(`Could not delete product with upc of ${upc}`);
                    } else {
                        fulfill();
                    }
                });
            });
        });
    },
    /*Update product given upc and desired fields and return
     *that product
    */
    updateProduct(upc, updatedProduct) {
        return new Promise((fulfill, reject) => {
            return this.getProductbyUPC(upc).then((currentProduct) => {
                let updatedProductData = {};
                if (updatedProduct.product_name) updatedProductData.product_name = updatedProduct.product_name;
                if (updatedProduct.product_picture) updatedProductData.product_picture = updatedProduct.product_picture;

                let updateCommand = {
                    $set: updatedProduct
                };
                return products().then((productCollection) => {
                    productCollection.updateOne({
                        _id: upc
                    }, updateCommand).then(() => {
                        fulfill(this.getProductbyUPC(upc));
                    });
                });
            });
        });
    }
}

module.exports = exportedMethods;