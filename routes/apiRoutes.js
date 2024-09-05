const express = require("express");
// imports files 
const noteRoute = require("./htmlRoutes");
// call express
const app = express();
// the route to notes
app.use("/notes", noteRoute);
// exports the module
module.exports = app;