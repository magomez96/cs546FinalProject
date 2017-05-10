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
        //Frontend stuff from Adam
        res.render("products/static", productsList);
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

router.post("/", (req, res) => {
    if (req.isAuthenticated()) {
        let productInfo = req.body;
        productsData.addProduct(productInfo.upc, productInfo.name, productInfo.pic).then((newProduct) => {
            res.redirect("/products");
        }).catch((err) => {
            res.render("products/static", {products: productsList, errpr: err});
        }); 
    } else {
        res.redirect("/login");
    }
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