const path = require("path");
const express = require("express");
const app = express();
const filesRoutes = require('./src/routes/filesRoutes')
const videoPlayerRoutes = require('./src/routes/videoPlayerRoutes')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join(__dirname + "/src")));

require("dotenv").config();

//open server
app.listen(parseInt(process.env.PORT), process.env.BASE_URL, () => {
	console.log(`Example app listening on url ${process.env.BASE_URL} port ${process.env.PORT}`);
});

// app routes
app.use("/", videoPlayerRoutes);
app.use('/files', filesRoutes)