const express = require('express');
const router = express.Router();
const data = require('../data');
const passport = require('passport');
const productsData = data.products;

router.get("/:upc", (req, res) => {
    productsData.getProductbyUPC(req.params.upc).then((gotProduct) => {
        res.json(gotProduct);
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

router.get("/", (req, res) => {
    productsData.getAllProducts().then((productsList) => {
        res.json(productsList);
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

router.post("/:upc", (req, res) => {
    let productInfo = req.body;
    productsData.addProduct(req.params.upc, productInfo.name, productInfo.pic).then((newProduct) => {
        res.redirect(`/products/${newProduct.upc}`)
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

router.put("/:upc", (req, res) => {
    productsData.updateProduct(req.params.upc, req.body).then((updatedProduct) => {
        res.redirect(`/products/${updatedProduct.upc}`)
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

router.delete("/:upc", (req, res) => {
    productsData.removeProduct(req.params.upc).then(() => {
        res.sendStatus(200); //Send success
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

module.exports = router;