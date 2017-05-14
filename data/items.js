const mongoCollections = require("../config/mongoCollections");
const items = mongoCollections.items;
const uuid = require('node-uuid');

let exportedMethods = {
    /*Get item given user Id and return that item if successful
     */
    getItemById(id) {
        return new Promise((fulfill, reject) => {
            return items().then((itemCollection) => {
                return itemCollection.findOne({
                    _id: id
                }).then((item) => {
                    if (!item) reject("Item not found");
                    fulfill(item);
                });
            });
        });
    },
    /*Get all items given user Id and return array of item objects 
     *belonging to the user 
     */
    getAllItems(id) {
        return new Promise((fulfill, reject) => {
            return items().then((itemCollection) => {
                return itemCollection.find({
                    userId: id
                }).toArray().then((itemArray) => {
                    if (!itemArray) reject(`No items found for user with id of ${id}`);
                    fulfill(itemArray);
                });
            });
        });
    },
    /*Add item given all required fields for a specific user
     *and return that item 
     */
    addItem(userId, nickname, upc, quantity, date_of_purchase, date_of_expiration) {
        return new Promise((fulfill, reject) => {
            return items().then((itemCollection) => {
                let newItem = {
                    _id: uuid.v4(),
                    userId: userId,
                    nickname: nickname,
                    upc: upc,
                    quantity: quantity,
                    date_of_purchase: date_of_purchase,
                    date_of_expiration: date_of_expiration
                };

                return itemCollection.insertOne(newItem).then((newInsertInformation) => {
                    return newInsertInformation.insertedId;
                }).then((newId) => {
                    fulfill(this.getItemById(newId));
                });
            });
        });
    },
    /*Remove item given user Id for a specific user
     */
    removeItem(id) {
        return new Promise((fulfill, reject) => {
            return items().then((itemCollection) => {
                itemCollection.removeOne({
                    _id: id
                }).then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        reject(`Could not delete item with id of ${id}`);
                    } else {
                        fulfill();
                    }
                });
            });
        });
    },
    /*Update item given user Id and desired fields and return
     *that item
     */
    updateItem(id, updatedItem) {
        return new Promise((fulfill, reject) => {
            return this.getItemById(id).then((currentItem) => {
                return items().then((itemCollection) => {
                    let updatedItemData = {};
                    if (updatedItem.nickname) updatedItemData.nickname = updatedItem.nickname;
                    if (updatedItem.quantity) updatedItemData.quantity = updatedItem.quantity;
                    if (updatedItem.date_of_purchase) updatedItemData.date_of_purchase = updatedItem.date_of_purchase;
                    if (updatedItem.date_of_expiration) updatedItemData.date_of_expiration = updatedItem.date_of_expiration;
                    let updateCommand = {
                        $set: updatedItemData
                    };
                    return itemCollection.updateOne({
                        _id: id
                    }, updateCommand).then(() => {
                        fulfill(this.getItemById(id));
                    });
                });
            });
        });
    },

    /*Perform a left outer join on products and items collections 
     *in order to get the right picture for each item. 
     */
    joinProducts(userId) {
        return new Promise((fulfill, reject) => {
            return items().then((itemCollection) => {
                var cursor = itemCollection.aggregate([
                    { "$match": { "userId": userId } },
                    {
                        "$lookup": {
                            "from": "products",
                            "localField": "upc",
                            "foreignField": "_id",
                            "as": "product_info"
                        }
                    },
                    { "$addFields": { "product_name": "$product_info.product_name", "product_picture": "$product_info.product_picture" } },
                    { "$unwind": "$product_name" }, { "$unwind": "$product_picture" },
                    { "$project": { "product_info": 0 } },
                ]);
                cursor.toArray(function(err, result) {
                    if (err) {
                        reject("Error performing join");
                    } else {
                        fulfill(result);
                    }
                });
            });
        });
    }
}

module.exports = exportedMethods;