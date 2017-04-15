const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const items = data.items;
const products = data.products;

dbConnection().then(db => {
	return db.dropDatabase().then(() => {
		return dbConnection;
	}).then((db) => {
		return products.addProduct("051500255162", "Jif Peanut Butter Creamy", "https://pics.drugstore.com/prodimg/494944/450.jpg");
	}).then(() => {
		return products.addProduct("041190571901", "Shoprite Sandwich White Bread", "http://content.shoprite.com/legacy/productimagesroot/DJ/8/164788.jpg");
	}).then(() => {
		//Pass = "1234"
		return users.addUser("$2a$04$tO3YCc6S2x7ssKwlm3rOiecoicyYVK/xuBS/0F3MCJ8PQ8uOu4aTW", "1", "Bob Ross", "Happy little plants only", "bobross@pbs.org");
	}).then(() => {
		//Pass = "password"
		return users.addUser("$2a$04$FpQEGLPDC.E.aWyBtB0vlOdy5MLSpVha390795nfmkI71ML2H8Iu6", "2", "Jane Doe", "Gluten free", "janedoe@gmail.com");
	}).then((janeDoe) => {
		const userId = janeDoe._id;
		let dateNow = new Date();
		let formatedDate = dateNow.getMonth()+ 1 + "" + dateNow.getDay() + "" + dateNow.getFullYear();
		let expireDate =  dateNow.getMonth()+ 1 + "" + dateNow.getDay() + "" + dateNow.getFullYear();
		return items.addItem(userId, "Peanut Butter for PB&J", "051500255162", 2, formatedDate, expireDate);
	}).then((itemAdded) => {
		const id = itemAdded.userId;
		let dateNow = new Date();
		let formatedDate = dateNow.getMonth()+ 1 + "" + dateNow.getDay() + "" + dateNow.getFullYear();
		let expireDate =  dateNow.getMonth()+ 1 + "" + dateNow.getDay() + "" + dateNow.getFullYear();
		return items.addItem(id, "Peanut Butter for PB&J", "051500255162", 2, formatedDate, expireDate);
	}).then(() => {
		console.log("Done seeding db");
		db.close();
	});
}, (error) => {
	console.log(error);
	return 
});