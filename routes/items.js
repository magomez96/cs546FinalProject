const express = require('express');
const router = express.Router();
const data = require('../data');
const passport = require('passport');
const xss = require('xss');
const usersData = data.users;
const itemsData = data.items;
const productsData = data.products;

/*Get all items by user ID
*/
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

/*Converts string of format yyyy-mm-dd to mm-dd-yyyy
*/
function changeDateFormat(inputDate) { //from yyyy-mm-dd to mm-dd-yyyy
    var splitDate = inputDate.split('-');
    if (splitDate.count == 0) {
        return null;
    }
    var year = splitDate[0];
    var month = splitDate[1];
    var day = splitDate[2];
    return month + '-' + day + '-' + year;
}

/*Add item after form is completed
*/
router.post("/", (req, res) => {
    if (req.isAuthenticated()) {
        let itemInfo = req.body;
        var date = new Date(itemInfo.purDate)

        itemsData.addItem(req.user._id, xss(itemInfo.nick), itemInfo.upc, itemInfo.quantity, changeDateFormat(itemInfo.purDate), changeDateFormat(itemInfo.expDate)).then((newItem) => {
            res.redirect(`/`);
        }).catch((err) => {
            res.status(500).json({ error: err });
        });
    } else {
        res.redirect("/login");
    }
});

/*Update an item
*/
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

/*Delete a specific item 
*/
router.delete("/:itemID", (req, res) => {
    if (req.isAuthenticated()) {;
        itemsData.removeItem(req.params.itemID).then(() => {
            res.redirect('/')
        }).catch((err) => {
            res.status(500).json({ error: err });
        });
    } else {
        res.redirect("/login");
    }
});

module.exports = router;