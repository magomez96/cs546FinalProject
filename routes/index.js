const itemsRoutes = require("./items");
const productsRoutes = require("./products");
const usersRoutes = require("./users");

const constructorMethod = (app) => {
    app.use("/", usersRoutes); //Send the user to the login page first
    app.use("/products", productsRoutes);
    app.use("/items", itemsRoutes);
    app.use("/users", usersRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    })
};

module.exports = constructorMethod;