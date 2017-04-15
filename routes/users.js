const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;

router.get("/", (req, res) => {
     usersData.getUserById("821a00fb-31a4-44b1-8a3d-090cd697682b").then((gotUser)=>{
     	res.json(gotUser);
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});

router.get("/remove", (req, res) => {
     usersData.removeUser("821a00fb-31a4-44b1-8a3d-090cd697682b").then(()=>{
     	res.json("DONE");
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});

router.get("/all", (req, res) => {
     usersData.getAllUsers().then((userList)=>{
     	res.json(userList);
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});

router.get("/update", (req, res) => {
     usersData.updateUser("821a00fb-31a4-44b1-8a3d-090cd697682b" , {"sessionId": "42", "diet": "somethiadfng", "name":"Bdaadsfasadfafdsfill Watersxs"}).then((updatedUser)=>{
     	res.json(updatedUser);
     }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});
module.exports = router;
