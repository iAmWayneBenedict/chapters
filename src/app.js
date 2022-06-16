const vid = document.querySelector(".vid");
const video = document.querySelector("source");
const textArea = document.querySelector("#textArea");
const copy = document.querySelector(".copy");
const textCopied = document.querySelector("#text-copied");
const chaptersBody = document.querySelector(".chapters-body");
const addChapters = document.querySelector(".add-chapters");
const addChapterBtn = document.querySelector(".add-chapter-btn");
const bg = document.querySelector(".bg");

addChapterBtn.addEventListener("click", (event) => {
	addChapters.style.display = "flex";
	bg.style.display = "flex";
});

bg.addEventListener("click", (event) => {
	addChapters.style.display = "none";
	bg.style.display = "none";
});

let vidName = "";

//   Fetch data from json file
const fetchData = async () => {
	let { req, data } = {};
	try {
		req = await fetch("jsonfile.json");
		data = await req.json();
	} catch (error) {
		alert("No data in JSON file");
	}
	const hasData = Object.keys(data).length !== 0;

	return { data, hasData };
};

copy.addEventListener("click", async (e) => {
	// split the string of timestamps with backslash ("\")
	const arrayPath = vid.value.split("\\");
	// get the name of the video
	vidName = arrayPath[arrayPath.length - 1];
	console.log(arrayPath[arrayPath.length - 1]);
	// get data from the fetched data
	let { data, hasData } = await fetchData();
	// declare temporary object container for the result of all timestamp data
	let tempObj = {};

	// populate hidden input value with timestamps
	if (hasData) {
		// populate tempObj with existing and new timestamps
		tempObj = {
			...data,
			...getTimeStamps(vidName),
		};
		textCopied.value = JSON.stringify(tempObj);
	} else {
		textCopied.value = JSON.stringify(getTimeStamps(vidName));
	}

	// select input field
	textCopied.select();
	// for android devices
	textCopied.setSelectionRange(0, 99999);
	// add to clipboard
	navigator.clipboard.writeText(textCopied.value);
	alert("Text Copied!");
});

const getTimeStamps = (vidName) => {
	// get the value of the textarea
	let enteredText = textArea.value;
	// split the string of timestamps with new line ("\n")
	let chapters = enteredText.split("\n");
	// declare a container for the inputted timestamps
	let jsonTimeStamp = {};
	// declare a temporary container for the value relative to the name of the video
	let tempArray = [];
	// map through the array of timestamps
	chapters.map((val, key) => {
		// declare a temporary object container for the time and description
		let tempObject = {};
		// declare a string container for the timestamps
		let timeStamp = "";
		// loop through the value of the timestamps in each of the characters
		for (let index = 0; index < val.length; index++) {
			// removes all emojis
			val = val.replace(/[^\p{L}\p{N}\p{P}\p{Z}{\^\$}]/gu, "").trim();
			// verify if the current character is a number or a colon
			if (!isNaN(val.charAt(index)) || val.charAt(index) === ":") {
				// verify if the current character is close bracket or a space, then break the loop
				if (val.charAt(index) === ")" || val.charAt(index) === " ") {
					break;
				}
				// verify if the current character is not a space, then push that character to the timestamp string container
				if (val.charAt(index) !== " ") {
					timeStamp += val.charAt(index);
				}
			}
		}
		// declare a short hand notation for the seconds, minutes, and hours
		// the timestamp should be reversed in order to verify if video takes an hour
		let [seconds, minutes, hours] = timeStamp.split(":").reverse();
		// set minutes into integer, then calculated to seconds or if there are no minutes then 0
		minutes = parseInt(minutes) * 60 || 0;
		// set hours into integer, then calculated to minutes and to seconds or if there are no hours then 0
		hours = parseInt(hours) * 60 * 60 || 0;
		// add the seconds, minutes, and hours to get the timestamp
		let time = parseInt(seconds) + minutes + hours;
		// set the time and value to the tempObject
		tempObject = { time, val };
		// push the tempObject to the tempArray
		// tempObject will be added until the last index of the loop
		tempArray.push(tempObject);
	});
	// set the jsonTimeStamp to the name of the video along with its value of the tempArray
	jsonTimeStamp[vidName] = tempArray;
	// return the jsonTimeStamp
	return jsonTimeStamp;
};

const hasUrlPath = () => {
	return !!window.location.search.length;
};

const hasVidSessionPath = () => {
	return sessionStorage.getItem("vidplayer") !== null;
};

const getVidUrlTime = () => {
	if (!hasUrlPath()) return 404;

	let url = window.location;
	let urlParameters = url.search.replace("?", "");
	return urlParameters.split("&")[1].split("=")[1];
};

const getVidSessionPath = () => {
	if (!hasVidSessionPath()) return 404;

	return sessionStorage.getItem("vidplayer");
};

const chapterTemplate = (
	title,
	timestamp,
	time,
	img = "./Arrow-floor-sticker-green-yellow.jpg"
) => {
	return `<div class="chapter">
				<div class="chapter-content">
					<h4>${title}</h4>
					<p>${timestamp}</p>
				</div>
				<input type="hidden" value="${time}">
			</div>`;
};

const chaptersDOM = async () => {
	if (getVidSessionPath() === 404) return;

	let chaptersDOMString = "";
	let vidSessionPath = getVidSessionPath();

	let { data, hasData } = await fetchData();
	if (!hasData) return "";

	Object.entries(data).map(([key, value]) => {
		if (key === vidSessionPath) {
			value.map(({ time, val }) => {
				if (time !== null) {
					let timestamp = "";
					let seconds = time % 60;
					let minutes = ((time - seconds) / 60) % 60;
					let hours = Math.floor(time / 60 / 60);
					timestamp = `${hours < 10 ? "0" + hours : hours}:${
						minutes < 10 ? "0" + minutes : minutes
					}:${seconds < 10 ? "0" + seconds : seconds}`;

					chaptersDOMString += chapterTemplate(val, timestamp, time);
				}
			});
		}
	});
	return chaptersDOMString;
};

const chapterToggle = function () {
	let timestamp = parseInt(this.children[1].value);
	video.parentElement.currentTime = timestamp;
};

const setVidData = async (event) => {
	if (getVidSessionPath() === 404) return;

	let vidSessionPath = getVidSessionPath();
	video.src = `vids/${vidSessionPath}`;
	chaptersBody.innerHTML = await chaptersDOM().then((data) => data);
	let timestamp = parseInt(getVidUrlTime().replace("s", ""));
	video.parentElement.load();
	video.parentElement.currentTime = timestamp;

	Array.from(document.querySelectorAll(".chapter")).forEach((el, key) => {
		el.addEventListener("click", chapterToggle);
	});
};

let rawData = JSON.parse(localStorage.getItem("vidplayer"));
vid.addEventListener("change", () => {
	const arrayPath = vid.value.split("\\");
	let vidName = arrayPath[arrayPath.length - 1];
	let timestamp = 0;
	sessionStorage.setItem("vidplayer", vidName);
	if (rawData !== null) {
		rawData.map(({ video, time }) => {
			if (video === vidName) {
				timestamp = time;
				return;
			}
		});
	}
	let url = window.location;
	location.href = `${url.pathname}?video=${vidName}&time=${timestamp}s`;
});

video.parentElement.addEventListener("timeupdate", (event) => {
	if (getVidSessionPath() === 404) return;

	let vidSessionPath = getVidSessionPath();
	let temp = "";
	if (rawData !== null) {
		for (const el of rawData) {
			if (el.video === vidSessionPath) {
				el.time = Math.floor(event.target.currentTime);
				temp = rawData;
				break;
			} else {
				temp = [
					{ video: vidSessionPath, time: Math.floor(event.target.currentTime) },
					...rawData,
				];
			}
		}
	} else {
		temp = [{ video: vidSessionPath, time: Math.floor(event.target.currentTime) }];
	}
	localStorage.setItem("vidplayer", JSON.stringify(temp));
});

const setChaptersHeight = () => {
	chaptersBody.style.height = video.parentElement.offsetHeight - 64 - 48 + "px";
};

// function initiators

video.parentElement.addEventListener("loadeddata", (event) => {
	setChaptersHeight();
});

window.onresize = () => {
	setChaptersHeight();
};

window.onload = () => {
	setVidData();
	setChaptersHeight();
};
