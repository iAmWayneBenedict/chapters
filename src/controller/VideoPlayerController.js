const fs = require("fs");
const router = require('express').Router()

const home = (req, res) => {
    res.render("index");
}


const add = (req, res) => {
    fs.writeFile("./public/json/jsonfile.json", JSON.stringify(req.body.data), function (err) {
        if (err) throw err;
        console.log("Replaced!");
        res.send(JSON.stringify({ response: "Replaced" }));
    });
}

module.exports = {
    home,
    add
}