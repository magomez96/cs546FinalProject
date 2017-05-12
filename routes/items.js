const express = require('express');
const router = express.Router();
const data = require('../data');
const passport = require('passport');
const usersData = data.users;
const itemsData = data.items;
const productsData = data.products;

//Get all items by user ID
router.get("/", (req, res) => {
    res.redirect("/");
    if (req.isAuthenticated()) {
        usersData.getUserById(req.user._id).then((gotUser) => {
            itemsData.joinProducts(req.user._id).then((items) => {
                res.render("homepage/static", [gotUser].concat(items));
            })
        }).catch((err) => {
            res.status(500).json({ error: err });
        });
    } else {
        res.redirect("/login");
    }
});

//Get a single item by ID
router.get("/:itemID", (req, res) => {
    if (req.isAuthenticated()) {
        itemsData.getItemById(req.params.itemID).then((item) => {
            res.json(item);
        }).catch((err) => {
            res.status(404).json({
                message: "Item not found"
            });
        });
    } else {
        res.redirect("/login");
    }
});

//Add an item, see line 44 for required field names
router.post("/", (req, res) => {
    if (req.isAuthenticated()) {
        let itemInfo = req.body;
        itemsData.addItem(req.user._id, itemInfo.nick, itemInfo.upc, itemInfo.quantity, itemInfo.purDate, itemInfo.expDate).then((newItem) => {
            res.redirect(`/`);
        }).catch((err) => {
            res.status(500).json({ error: err });
        });
    } else {
        res.redirect("/login");
    }
});

//Update an item
router.put("/:itemID", (req, res) => {
    if (req.isAuthenticated()) {
        itemsData.updateItem(req.params.itemID, req.body).then((updatedItem) => {
            res.redirect(`/items/${updatedItem._id}`);
        }).catch((err) => {
            res.status(500).json({ error: err });
        });
    } else {
        res.redirect("/login");
    }
});

//Delete an item, obviously
router.delete("/:itemID", (req, res) => {
    if (req.isAuthenticated()) {;
        itemsData.removeItem(req.params.itemID).then(() => {
            res.sendStatus(200); //Send success
        }).catch((err) => {
            res.status(500).json({ error: err });
        });
    } else {
        res.redirect("/login");
    }
});

module.exports = router;