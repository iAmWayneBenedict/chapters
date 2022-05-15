const vid = document.querySelector(".vid");
const textArea = document.querySelector("#textArea");
const copy = document.querySelector(".copy");
const textCopied = document.querySelector("#text-copied");

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

// console.log(hasData());
// fetchData().then(({ data, hasData }) => console.log(data, hasData));
