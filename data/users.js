const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('node-uuid');

let exportedMethods = {
    getUserById(id) {
        return new Promise((fulfill, reject) => {
            return users().then((userCollection) => {
                return userCollection.findOne({ _id: id }).then((user) => {
                    if (!user) reject("User not found");
                    fulfill(user);
                });
            });
        });
    },

    getUserByEmail(email) {
        return new Promise((fulfill, reject) => {
            return users().then((userCollection) => {
                return userCollection.findOne({ "profile.email": email }).then((user) => {
                    if (!user) reject("User not found");
                    fulfill(user);
                });
            });
        });
    },

    getAllUsers() {
        return new Promise((fulfill, reject) => {
            return users().then((userCollection) => {
                fulfill(userCollection.find({}).toArray());
            });
        });
    },

    addUser(hashedPassword, sessionId, name, diet, email) {
        return new Promise((fulfill, reject) => {
            return users().then((userCollection) => {
                let newUser = {
                    _id: uuid.v4(),
                    sessionId: sessionId,
                    hashedPassword: hashedPassword,
                    profile: {
                        name: name,
                        diet: diet,
                        email: email
                    }
                };

                return userCollection.insertOne(newUser).then((newInsertInformation) => {
                    return newInsertInformation.insertedId;
                }).then((newId) => {
                    fulfill(this.getUserById(newId));
                });
            });
        });
    },
    removeUser(id) {
        return new Promise((fulfill, reject) => {
            return users().then((userCollection) => {
                userCollection.removeOne({ _id: id }).then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        reject(`Could not delete user with id of ${id}`);
                    } else {
                        fulfill();
                    }
                });
            });
        });
    },
    updateUser(id, updatedUser) {
        return new Promise((fulfill, reject) => {
            return this.getUserById(id).then((currentUser) => {
                return users().then((userCollection) => {
                    if (updatedUser.sessionId) userCollection.updateOne({ _id: id }, { $set: { 'sessionId': updatedUser.sessionId } });
                    if (updatedUser.name) userCollection.updateOne({ _id: id }, { $set: { 'profile.name': updatedUser.name } });
                    if (updatedUser.diet) userCollection.updateOne({ _id: id }, { $set: { 'profile.diet': updatedUser.diet } });
                    if (updatedUser.email) userCollection.updateOne({ _id: id }, { $set: { 'profile.email': updatedUser.email } });
                    fulfill(this.getUserById(id));
                });
            });
        });
    }
}

module.exports = exportedMethods;