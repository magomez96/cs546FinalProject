const mongoCollections = require("../config/mongoCollections");
const items = mongoCollections.items;
const uuid = require('node-uuid');

let exportedMethods = {
	getItemById(id) {
        return items().then((itemCollection) => {
            return itemCollection.findOne({ _id: id }).then((item) => {
                if (!item) throw "Item not found";
                return item;
            });
        });
    },

    //TODO: Get all products by User id 

	addItem(userId, nickname, upc, quantity, date_of_purchase, date_of_expiration) {
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
                return this.getItemById(newId);
            });
        });
    },
    removeItem(id) {
        return items().then((itemCollection) => {
            return itemCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete item with id of ${id}`)
                }
            });
        });
    },
    updateItem(id, updatedItem) {
        return this.getItemById(id).then((currentItem) => {
            let updatedItemData = {};
            if(updatedItem.nickname) updatedItemData.nickname = updatedItem.nickname;

            let updateCommand = { 
                $set: updatedItem
            };
            return itemCollection.updateOne({ _id: id }, updateCommand).then(() => {
                return this.getItemById(id);
            });
        });
    },
}

module.exports = exportedMethods;