const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const puppeteer = require('puppeteer');
const multer = require("multer")
const upload = multer({ dest: '/public/vids' })
const filesRoutes = require('./src/routes/filesRoutes')
const videoPlayerRoutes = require('./src/routes/videoPlayerRoutes')

// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join(__dirname + "/src")));

const root = path.dirname(require.main.filename)

require("dotenv").config();

app.listen(parseInt(process.env.PORT), process.env.BASE_URL, () => {
	console.log(`Example app listening on url ${process.env.BASE_URL} port ${process.env.PORT}`);
});

app.use("/", videoPlayerRoutes);
app.use('/files', filesRoutes)