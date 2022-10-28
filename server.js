const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const puppeteer = require('puppeteer');
const pretty = require("pretty");

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

app.post("/get-key-moments", async (req, res) => {
	const requestUrl = req.body.data
	const browser = await puppeteer.launch({headless: false})
	const page = await browser.newPage()
	await page.goto(requestUrl + "&themeRefresh=1")
	// await page.screenshot({path:"mywebsite.png"})

	const grabTimeStamps = await page.evaluate( async () => {
		let responseData = null;
		let timerCounter = 0;

		function getData() {
			return new Promise((resolve, reject) => {
				let myData = setInterval(async () => {
					timerCounter++;
					let seeMore = document.querySelectorAll("#expand.button.style-scope.ytd-text-inline-expander")
					let items;
					if (seeMore.length !== 0) {

						seeMore[0].click()

						//view all
						let viewAll = document.querySelectorAll('#navigation-button.style-scope.ytd-rich-list-header-renderer')[0]
						viewAll.querySelectorAll('.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--size-m')[0].click()

						//get element
						let element = document.querySelectorAll('#contents.style-scope.ytd-macro-markers-list-renderer')[0]

						// get items
						items = Array.from(element.querySelectorAll("#details.style-scope.ytd-macro-markers-list-item-renderer"))
					} else {
						document.querySelectorAll("#more.style-scope.ytd-expander")[1].click()

						//view all
						document.querySelectorAll("#button.style-scope.ytd-button-renderer.style-blue-text[aria-label='View all']")[1].click()
						// style-scope ytd-button-renderer style-blue-text

						//get element
						let element = document.querySelectorAll("#content.style-scope.ytd-engagement-panel-section-list-renderer")[1]

						// get items
						items = Array.from(element.querySelectorAll("#details.style-scope.ytd-macro-markers-list-item-renderer"))
					}

					let data = []
					items.map((el, index) => {
						//get title
						let title = el.firstElementChild;
						let titleText = title.textContent;

						//get time
						let time = el.lastElementChild.textContent;
						data.push(`${time} ${titleText}\n`);

					})
					return resolve(data)
				}, 10000)

				setInterval(() => {
					console.log(timerCounter)
					if (timerCounter > 1) {
						return resolve({reject: true})
					}
				}, 1000)
			})
		}
		return await getData()


	})
	// console.log(grabTimeStamps)
	res.json({response: grabTimeStamps})
	await browser.close()
})
