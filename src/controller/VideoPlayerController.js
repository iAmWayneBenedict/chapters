const fs = require("fs");
const router = require('express').Router()
const path = require('path')

const home = (req, res) => {
    // const indexHtml = fs.readFileSync("./views/index.ejs", {encoding:'utf8', flag:'r'})
    // res.set('Content-Type', 'text/html');
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