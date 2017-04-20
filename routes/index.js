const itemsRoutes = require("./items");
const productsRoutes = require("./products");
const usersRoutes = require("./users");

const constructorMethod = (app) => {
    app.use("/products", productsRoutes);
    app.use("/items", itemsRoutes);
    app.use("/users", usersRoutes);
    app.use("/", usersRoutes);

    app.use("*", (req, res) => {
        res.redirect("/")
    })
};

module.exports = constructorMethod;