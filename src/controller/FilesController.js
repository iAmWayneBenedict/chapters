const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const BreadCrumbsControllerHelperClass = require("./breadCrumbsControllerHelperClass");
const StacksControllerHelperClass = require("./stacksControllerHelperClass");

const getPath = (req, res) => {
	console.log(req.file);
	// const absolutePath = path.join(root, req.files[])
};

const fileExists = (dir) => {
	try {
		fs.statSync(dir);
		return true;
	} catch (e) {
		return false;
	}
};

const openDir = (path, reqFile) => {
	let files = fs.readdirSync(path);
	let fileFound = null;
	let exists = fileExists(path + reqFile);
	if (exists) {
		fileFound = reqFile;
		return {
			found: true,
			file: fileFound,
		};
	}

	let filteredFiles = files.filter((file) => {
		if (fs.lstatSync(path + file).isDirectory()) return file;
	});

	return {
		found: false,
		file: filteredFiles,
	};
};

const getDirPath = async (req, res) => {
	const VIDS_PATH = "./public/vids/";
	let breadCrumbs = new BreadCrumbsControllerHelperClass([VIDS_PATH]);
	let stacks = new StacksControllerHelperClass();

	//implemented stacks data structure
	while (true) {
		let newDirs = openDir(breadCrumbs.joinArr(""), req.params.filename);
		if (newDirs.found) {
			res.json({
				response: {
					dir: breadCrumbs.joinArr(""),
					file: newDirs.file,
				},
			});
			break;
		} else {
			if (newDirs.file.length !== 0) {
				stacks.insertFirst(newDirs.file);
				breadCrumbs.insertLast(stacks.getFirst());
			} else {
				stacks.removeFirst();
				breadCrumbs.removeLast();
				breadCrumbs.insertLast(stacks.getFirst());
			}
		}
	}
};

const getKeyMoments = async (req, res) => {
	const requestUrl = req.body.data;
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(requestUrl + "&themeRefresh=1");
	// await page.screenshot({path:"mywebsite.png"})

	const grabTimeStamps = await page.evaluate(async () => {
		let responseData = null;

		function getData() {
			return new Promise((resolve, reject) => {
				setInterval(async () => {
					let seeMore = document.querySelectorAll(
						"#expand.button.style-scope.ytd-text-inline-expander"
					);
					let items;
					if (seeMore.length !== 0) {
						seeMore[0].click();

						//view all
						let viewAll = document.querySelectorAll(
							"#navigation-button.style-scope.ytd-rich-list-header-renderer"
						)[0];
						viewAll
							.querySelectorAll(
								".yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--size-m"
							)[0]
							.click();

						//get element
						let element = document.querySelectorAll(
							"#contents.style-scope.ytd-macro-markers-list-renderer"
						)[0];

						// get items
						items = Array.from(
							element.querySelectorAll(
								"#details.style-scope.ytd-macro-markers-list-item-renderer"
							)
						);
					} else {
						document.querySelectorAll("#more.style-scope.ytd-expander")[1].click();

						//view all
						document
							.querySelectorAll(
								"#button.style-scope.ytd-button-renderer.style-blue-text[aria-label='View all']"
							)[1]
							.click();
						// style-scope ytd-button-renderer style-blue-text

						//get element
						let element = document.querySelectorAll(
							"#content.style-scope.ytd-engagement-panel-section-list-renderer"
						)[1];

						// get items
						items = Array.from(
							element.querySelectorAll(
								"#details.style-scope.ytd-macro-markers-list-item-renderer"
							)
						);
					}

					let data = [];
					items.map((el, index) => {
						//get title
						let title = el.firstElementChild;
						let titleText = title.textContent;

						//get time
						let time = el.lastElementChild.textContent;
						data.push(`${time} ${titleText}\n`);
					});
					if (data.length > 0)
						return resolve(data);
					else
						return resolve({ reject: true });
				}, 10000);
			});
		}
		return await getData();
	});
	// console.log(grabTimeStamps)
	res.json({ response: grabTimeStamps });
	await browser.close();
};

const openVidsDirectory = (req, res) => {
	require("child_process").spawn("explorer.exe", ["D:\\chapters\\public\\vids"])

	res.send(`
		<script> window.close() </script>
	`)
}

module.exports = {
	getPath,
	getDirPath,
	getKeyMoments,
	openVidsDirectory
};
