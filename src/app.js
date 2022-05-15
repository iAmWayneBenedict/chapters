const vid = document.querySelector(".vid");
const textArea = document.querySelector("#textArea");
const copy = document.querySelector(".copy");
const textCopied = document.querySelector("#text-copied");

let vidName = "";

copy.addEventListener("click", (e) => {
	const arrayPath = vid.value.split("\\");
	vidName = arrayPath[arrayPath.length - 1];

	textCopied.value = getTimeStamps(vidName);
	textCopied.select();
	textCopied.setSelectionRange(0, 99999);
	navigator.clipboard.writeText(textCopied.value);
});

const getTimeStamps = (vidName) => {
	let enteredText = textArea.value;
	let chapters = enteredText.split("\n");
	let jsonTimeStamp = {};
	let tempArray = [];
	chapters.map((val, key) => {
		let tempObject = {};
		let timeStamp = "";
		for (let index = 0; index < val.length; index++) {
			if (!isNaN(val.charAt(index)) || val.charAt(index) === ":") {
				if (val.charAt(index) === ")" || val.charAt(index) === " ") {
					break;
				}
				if (val.charAt(index) !== " ") {
					timeStamp += val.charAt(index);
				}
			}
		}
		let [seconds, minutes, hours] = timeStamp.split(":").reverse();
		minutes = parseInt(minutes) * 60 || 0;
		hours = parseInt(hours) * 60 * 60 || 0;
		let time = parseInt(seconds) + minutes + hours;
		tempObject = { time, val };
		tempArray.push(tempObject);
	});
	jsonTimeStamp[vidName] = tempArray;
	return JSON.stringify(jsonTimeStamp);
};

//   Fetch data from json file
const fetchData = async () => {
	let [req, data] = {};
	try {
		req = await fetch("jsonfile.json");
		data = await req.json();
	} catch (error) {
		alert("No data in JSON file");
	}
	const hasData = Object.keys(data).length !== 0;
	return { data, hasData };
};

// console.log(hasData());
fetchData().then(({ data, hasData }) => console.log(data, hasData));
