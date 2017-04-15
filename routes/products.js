const express = require('express');
const router = express.Router();
const data = require('../data');
const passport = require('passport');
const productsData = data.products;

router.get("/:upc", (req, res) => {
     productsData.getProductbyUPC(req.params.upc).then((gotProduct)=>{
     	res.json(gotProduct);
     }, () => {
        // Something went wrong with the server!
        res.status(500).json({message: "Internal Server Error"});
    });
});

router.get("/", (req, res) => {
     productsData.getAllProducts().then((productsList)=>{
     	res.json(productsList);
     }, () => {
        // Something went wrong with the server!
        res.status(500).json({message: "Internal Server Error"});
    });
});

router.post("/:upc", (req, res) => {
    let productInfo = rec.body;
     productsData.addProduct(rec.params.upc, productInfo.name, productInfo.pic).then((newProduct)=>{
     	res.redirect(`/products/${newProduct.upc}`)
     }, () => {
        // Something went wrong with the server!
        res.status(500).json({message: "Internal Server Error"});
    });
});

router.put("/:upc", (req, res) => {
     productsData.updateProduct(req.params.upc, req.body).then((updatedProduct)=>{
     	res.redirect(`/products/${updatedProduct.upc}`)
     }, () => {
        // Something went wrong with the server!
        res.status(500).json({message: "Internal Server Error"});
    });
});

router.delete("/:upc", (req, res) => {
     productsData.removeProduct(req.params.upc).then(()=>{
     	res.sendStatus(200); //Send success
     }, () => {
        // Something went wrong with the server!
        res.status(500).json({message: "Internal Server Error"});
    });
});

module.exports = router;
