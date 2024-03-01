var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/carts", require("./routes/cartsRoute"));
app.use("/users", require("./routes/usersRoutes"));
app.use("/cartRows", require("./routes/cartRowsRoute"));

module.exports = app;
