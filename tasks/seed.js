const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const items = data.items;
const products = data.products;
var rossId = 0
var dateNow = new Date();
var dateTomorrow = new Date();
var dateWeekAhead = new Date();
var date2WeekAhead = new Date();
var dateYesterday = new Date();

dateTomorrow.setDate(dateTomorrow.getDate() + 1); 
dateWeekAhead.setDate(dateWeekAhead.getDate() + 5);
date2WeekAhead.setDate(date2WeekAhead.getDate() + 13);
dateYesterday.setDate(dateYesterday.getDate() - 1);

dbConnection().then(db => {
    return db.dropDatabase().then(() => {
        return dbConnection;
    }).then((db) => {
        return products.addProductInit("051500255162", "Jif Peanut Butter Creamy", "https://pics.drugstore.com/prodimg/494944/450.jpg");
    }).then(() => {
        return products.addProductInit("041190571901", "Shoprite Sandwich White Bread", "http://content.shoprite.com/legacy/productimagesroot/DJ/8/164788.jpg");
    }).then(() => {
        return products.addProductInit("016000275638", "General Mills Total Cereal", "https://i5.walmartimages.com/asr/b0442517-0147-4703-a17b-a8e45684abef_1.2ec464c5751f281255d794398d9af225.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff");
    }).then(() => {
        return products.addProductInit("040000011033", "3 Musketeers Chocolate Candy Bar", "https://www.3musketeers.com/Content/images/nutrition/products/large/product_1.jpg");
    }).then(() => {
        return products.addProductInit("759474100012", "Elyon Marshmallows Natural Vanilla", "http://images.prod.meredith.com/product/f15977e673e7f29bbebc0d88e68fba5b/0bbdf934526709f4b8ff9c0eb471837caa708429c49a9861b130ef217135cf39/l/elyon-marshmallows-natural-vanilla-7-0-oz");
    }).then(() => {
        return products.addProductInit("044000025298", "Nabisco Oreo ", "http://ecx.images-amazon.com/images/I/51cGjp6uMmL._SL160_.jpg");
    }).then(() => {
        //Pass = "1234"
        return users.addUser("$2a$04$tO3YCc6S2x7ssKwlm3rOiecoicyYVK/xuBS/0F3MCJ8PQ8uOu4aTW", "1", "Bob Ross", "Happy little plants only", "cs546bobross@mailinator.com ");
    }).then((bobross) => {
        rossId = bobross._id
        //Pass = "password"
        return users.addUser("$2a$04$FpQEGLPDC.E.aWyBtB0vlOdy5MLSpVha390795nfmkI71ML2H8Iu6", "2", "Jane Doe", "Gluten free", "cs546janedoe@mailinator.com");
    }).then((janeDoe) => {
        const userId = janeDoe._id;
        let formatedDate = (dateNow.getMonth() + 1) + "-" + dateNow.getUTCDate() + "-" + dateNow.getFullYear();
        let expireDate = (dateTomorrow.getMonth() + 1) + "-" + dateTomorrow.getUTCDate() + "-" + dateTomorrow.getFullYear();
        return items.addItem(userId, "Peanut Butter for PB&J", "051500255162", 2, formatedDate, expireDate);
    }).then((itemAdded) => {
        const id = itemAdded.userId;
        let formatedDate = (dateYesterday.getMonth() + 1) + "-" + dateYesterday.getUTCDate() + "-" + dateYesterday.getFullYear();
        let expireDate = (dateWeekAhead.getMonth() + 1) + "-" + dateWeekAhead.getUTCDate() + "-" + dateWeekAhead.getFullYear();
        return items.addItem(id, "Bread for PB&J", "041190571901", 1, formatedDate, expireDate);
    }).then((itemAdded) => {
        const id = itemAdded.userId;
        let formatedDate = (dateNow.getMonth() + 1) + "-" + dateNow.getUTCDate() + "-" + dateNow.getFullYear();
        let expireDate = (date2WeekAhead.getMonth() + 1) + "-" + date2WeekAhead.getUTCDate() + "-" + date2WeekAhead.getFullYear();
        return items.addItem(id, "Total Cereal", "016000275638", 3, formatedDate, expireDate);
    }).then((itemAdded) => {
        const id = itemAdded.userId;
        let formatedDate = (dateYesterday.getMonth() + 1) + "-" + dateYesterday.getUTCDate() + "-" + dateYesterday.getFullYear();
        let expireDate = (dateYesterday.getMonth() + 1) + "-" + dateYesterday.getUTCDate() + "-" + dateYesterday.getFullYear();
        return items.addItem(id, "Oreos", "044000025298", 9000, formatedDate, expireDate);
    }).then((itemAdded) => {
        const id = itemAdded.userId;
        let formatedDate = (dateNow.getMonth() + 1) + "-" + dateNow.getUTCDate() + "-" + dateNow.getFullYear();
        let expireDate = (dateNow.getMonth() + 1) + "-" + dateNow.getUTCDate() + "-" + dateNow.getFullYear();
        return items.addItem(id, "Chocolate Bar", "040000011033", 3, formatedDate, expireDate);
    }).then((itemAdded) => {
        const id = itemAdded.userId;
        let formatedDate = (dateNow.getMonth() + 1) + "-" + dateNow.getUTCDate() + "-" + dateNow.getFullYear();
        let expireDate = (dateWeekAhead.getMonth() + 1) + "-" + dateWeekAhead.getUTCDate() + "-" + dateWeekAhead.getFullYear();
        return items.addItem(id, "Marshmallows 4 Smores", "759474100012", 2, formatedDate, expireDate);
    }).then((itemAdded) => {
        const id = rossId;
        let formatedDate = (dateNow.getMonth() + 1) + "-" + dateNow.getUTCDate() + "-" + dateNow.getFullYear();
        let expireDate = (dateNow.getMonth() + 1) + "-" + dateNow.getUTCDate() + "-" + dateNow.getFullYear();
        return items.addItem(id, "Oreo Cookies", "044000025298", 1, formatedDate, expireDate);
    }).then(() => {
        console.log("Done seeding db");
        db.close();
    });
}, (error) => {
    console.log(error);
    return
});