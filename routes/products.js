const express = require('express');
const router = express.Router();
const data = require('../data');
const productsData = data.products;

router.get("/", (req, res) => {
     productsData.getProductbyUPC("051500255162").then((gotProduct)=>{
     	res.json(gotProduct);
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});

router.get("/remove", (req, res) => {
     productsData.removeProduct("041190571901").then(()=>{
     	res.json("DONE");
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});

router.get("/all", (req, res) => {
     productsData.getAllProducts().then((prodList)=>{
     	res.json(prodList);
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});

module.exports = router;
