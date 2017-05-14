const express = require('express');
const router = express.Router();
const data = require('../data');
const passport = require('passport');
const xss = require("xss");
const productsData = data.products;

/*Get a specific product
*/
router.get("/:upc", (req, res) => {
    productsData.getProductbyUPC(req.params.upc).then((gotProduct) => {
        res.json(gotProduct);
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});
/*"Store"-front page that displays all products
 *used by any of the users
*/ 
router.get("/", (req, res) => {
    productsData.getAllProducts().then((productsList) => {
        //Frontend stuff from Adam
        if (req.isAuthenticated())
            res.render("products/static", {user: req.user, products: productsList});
        else 
            res.render("products/static", {products: productsList});
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});
/*Add new product after form is filled
*/
router.post("/", (req, res) => {
    if (req.isAuthenticated()) {
        let productInfo = req.body;
        productsData.addProduct(productInfo.upc, xss(productInfo.name), productInfo.pic).then((newProduct) => {
            res.redirect("/products");
        }).catch((err) => {
                productsData.getAllProducts().then((productsList) => {
                //Frontend stuff from Adam
                res.render("products/static", {products: productsList, error: err});
            });
        }); 
    } else {
        res.redirect("/login");
    }
});
/*Update a specific product
*/
router.put("/:upc", (req, res) => {
    productsData.updateProduct(req.params.upc, req.body).then((updatedProduct) => {
        res.redirect(`/products/${updatedProduct.upc}`)
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

/*Delete a specific product 
*/
router.delete("/:upc", (req, res) => {
    productsData.removeProduct(req.params.upc).then(() => {
        res.sendStatus(200); //Send success
    }).catch((err) => {
        // Something went wrong with the server!
        res.status(500).json({ error: err });
    });
});

module.exports = router;