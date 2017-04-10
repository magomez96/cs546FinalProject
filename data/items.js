const mongoCollections = require("../config/mongoCollections");
const items = mongoCollections.items;
const uuid = require('node-uuid');

let exportedMethods = {
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

    //This should work
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
    removeItem(id) {
        return new Promise((fulfill, reject) => {
            return items().then((itemCollection) => {
                fulfill(itemCollection.removeOne({
                    _id: id
                })).then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        reject(`Could not delete item with id of ${id}`);
                    }
                });
            });
        });
    },
    updateItem(id, updatedItem) {
        return new Promise((fulfill, reject) => {
            return this.getItemById(id).then((currentItem) => {
                let updatedItemData = {};
                if (updatedItem.nickname) updatedItemData.nickname = updatedItem.nickname;

                let updateCommand = {
                    $set: updatedItem
                };
                return itemCollection.updateOne({
                    _id: id
                }, updateCommand).then(() => {
                    fulfill(this.getItemById(id));
                });
            });
        });
    }
}

module.exports = exportedMethods;