const { static } = require('express');
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const PORT = process.env.PORT || 3000;
const app = express();


app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("./Develop/public"));

mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require("./Develop/routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

