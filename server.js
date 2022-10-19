const http = require("http");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

const express = require("express");
const app = express();

// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));

require("dotenv").config();

app.listen(process.env.PORT, process.env.BASE_URL, () => {
	console.log(`Example app listening on url ${process.env.BASE_URL} port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/add", (req, res) => {
	fs.writeFile("./public/json/jsonfile.json", JSON.stringify(req.body.data), function (err) {
		if (err) throw err;
		console.log("Replaced!");
		res.send(JSON.stringify({ response: "Replaced" }));
	});
});
