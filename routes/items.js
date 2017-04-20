const express = require('express');
const router = express.Router();
const data = require('../data');
const passport = require('passport');
const itemsData = data.items;

//Get all items by user ID
router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        itemsData.getAllItems(req.user._id).then((items) => {
            res.json(items);
        }).catch((err) => {
            res.status(500).json({ error: err });
        });
    } else {
        res.status(401).json({
            message: "Not logged in"
        });
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
        res.status(401).json({
            message: "Not logged in"
        });
    }
});

//Add an item, see line 44 for required field names
router.post("/", (req, res) => {
    if (req.isAuthenticated()) {
        let itemInfo = req.body;
        itemsData.addItem(req.user.id, itemInfo.nick, itemInfo.upc, itemInfo.quantity, itemInfo.purDate, itemInfo.expDate).then((newItem) => {
            res.redirect(`/items/${newItem._id}`);
        }).catch((err) => {
            res.status(500).json({ error: err });
        });
    } else {
        res.status(401).json({
            message: "Not logged in"
        });
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
        res.status(401).json({
            message: "Not logged in"
        });
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
        res.status(401).json({
            message: "Not logged in"
        });
    }
});

module.exports = router;