const express = require('express');
const router = express.Router();
const data = require('../data');
const itemsData = data.items;

router.get("/", (req, res) => {
     itemsData.getItem("830c3ef8-7077-4a05-82e9-948dde2dea6d").then((gotItem)=>{
     	res.json(gotItem);
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});

router.get("/remove", (req, res) => {
     itemsData.removeItem("830c3ef8-7077-4a05-82e9-948dde2dea6d").then(()=>{
     	res.json("DONE");
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});

router.get("/all", (req, res) => {
     itemsData.getAllItems("c0b7f017-1222-4b31-a5be-bb0a993210cb").then((itemList)=>{
     	res.json(itemList);
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});


router.get("/update", (req, res) => {
     itemsData.updateItem("830c3ef8-7077-4a05-82e9-948dde2dea6d", {"nickname": "TESTING UPDATE"}).then((itemList)=>{
     	res.json(itemList);
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});

router.get("/add", (req, res) => {
		let dateNow = new Date();
		let formatedDate = dateNow.getMonth()+ 1 + "" + dateNow.getDay() + "" + dateNow.getFullYear();
		let expireDate =  dateNow.getMonth()+ 1 + "" + dateNow.getDay() + "" + dateNow.getFullYear();
		itemsData.addItem("c0b7f017-1222-4b31-a5be-bb0a993210cb", "Peanut Butter for PB&J", "051500255162", 3, formatedDate, expireDate).then((itemList)=>{
     	    res.json(itemList);
        }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});


module.exports = router;
