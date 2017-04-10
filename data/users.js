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

    //Password hashed here or in routes?
    //Should email be in profiles? Are we treating as a username
    //or should it be separate 
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
                fulfill(userCollection.removeOne({ _id: id })).then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        reject(`Could not delete user with id of ${id}`);
                    }
                });
            });
        });
    },
    updateUser(id, updatedUser) {
        return new Promise((fulfill, reject) => {
            return this.getUserById(id).then((currentUser) => {
                let updatedUserData = { profile: {} };
                if (updatedUser.sessionId) updatedUserData.sessionId = updatedUser.sessionId;
                if (updatedUser.name) updatedUserData.profile.name = updatedUser.name;
                if (updatedUser.diet) updatedUserData.profile.diet = updatedUser.diet;
                if (updatedUser.email) updatedUserData.profile.email = updatedUser.email;

                let updateCommand = {
                    $set: updatedUser
                };
                return userCollection.updateOne({ _id: id }, updateCommand).then(() => {
                    fulfill(this.getUserById(id));
                });
            });
        });
    }
}

module.exports = exportedMethods;