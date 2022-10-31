const playButton = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
const maximizeBtn = document.querySelector(".maximize-btn");
const minimizeBtn = document.querySelector(".minimize-btn");
const theatreBtn = document.querySelector(".theatre-btn");
const videoPlayer = document.querySelector("video");
const videoNav = document.querySelector(".video-nav");
const videoPlayerContainer = videoPlayer.parentElement.parentElement;
const sliderSliced = document.querySelector(".slider-sliced");
const playedSliced = document.querySelector(".played-sliced");
const timeskipSliced = document.querySelector(".timeskip-sliced");
const slicedTimelineCon = document.querySelector(".sliced-timeline-con");
const volumeCon = document.querySelector(".volume-con");
const vidDuration = document.querySelector(".vid-duration");
const vidCurrentTime = document.querySelector(".vid-current-time");
const chapterTooltip = document.querySelector(".chapter-tooltip .content");
import fetchData from "./index.js";
import { setChaptersHeight } from "./app.js";

let fetchedData;
fetchData().then((data) => {
	fetchedData = data.data[sessionStorage.getItem("vidplayer")];
});

async function setChapters() {
	let { data, hasData } = await fetchData();
	let hasVidData = false;

	if (hasData) {
		for (const key in data) {
			if (key === sessionStorage.getItem("vidplayer")) {
				setChapterTimeLine(data, key);
				hasVidData = true;
				break;
			}
		}
	}

	if (!hasVidData) {
		let span = document.createElement("span");
		span.style.width = "100%";
		span.dataset.value = 100;
		sliderSliced.appendChild(span);

		let spanParent = document.createElement("span");
		let divChild = document.createElement("div");

		spanParent.style.width = "100%";
		spanParent.appendChild(divChild);
		playedSliced.appendChild(spanParent);

		let spanParent2 = document.createElement("span");
		let divChild2 = document.createElement("div");

		spanParent2.style.width = "100%";
		spanParent2.appendChild(divChild2);
		timeskipSliced.appendChild(spanParent2);
	}
}

function setChapterTimeLine(data, key) {
	let vidData = data[key];
	let prevKey = 0;
	for (const key in vidData) {
		if (vidData[key].time === null || key === "0") continue;
		let span = document.createElement("span");
		let percentWidth =
			(vidData[key].time / videoPlayer.duration) * 100 -
			(vidData[prevKey].time / videoPlayer.duration) * 100;
		if (percentWidth === 0) {
			span.style.marginRight = "0px";
		}
		span.dataset.value = (vidData[key].time / videoPlayer.duration) * 100;
		span.style.width = percentWidth + "%";
		sliderSliced.appendChild(span);
		if (parseInt(key) === vidData.length - 1) {
			let span = document.createElement("span");
			let percentWidth = 100 - (vidData[key].time / videoPlayer.duration) * 100;
			if (percentWidth === 0) {
				span.style.marginRight = "0px";
			}
			span.dataset.value = 100;
			span.style.width = percentWidth + "%";
			sliderSliced.appendChild(span);
		}
		prevKey = key;
	}

	const sliderSlicedSpans = sliderSliced.children;
	const playedSlicedSpans = playedSliced.children;
	playedSliced.innerHTML = "";

	for (let index = 0; index < sliderSlicedSpans.length; index++) {
		let relativeSpanWidth = parseFloat(sliderSlicedSpans[index].style.width.replace("%", ""));
		let spanParent = document.createElement("span");
		let divChild = document.createElement("div");

		spanParent.style.width = relativeSpanWidth + "%";
		spanParent.appendChild(divChild);
		playedSliced.appendChild(spanParent);

		let spanParent2 = document.createElement("span");
		let divChild2 = document.createElement("div");

		spanParent2.style.width = relativeSpanWidth + "%";
		spanParent2.appendChild(divChild2);
		timeskipSliced.appendChild(spanParent2);
	}
}

videoPlayer.onloadeddata = () => {
	setChapters();
	setVidDuration();
	setVidCurrentDuration();
};

playButton.addEventListener("click", (event) => {
	videoPlayer.play();
	playButton.style.display = "none";
	pauseBtn.style.display = "flex";
});

pauseBtn.addEventListener("click", (event) => {
	videoPlayer.pause();
	playButton.style.display = "flex";
	pauseBtn.style.display = "none";
});

maximizeBtn.addEventListener("click", (event) => {
	let img = maximizeBtn.children[0];
	if (document.fullscreenElement === null) {
		videoPlayer.parentElement.requestFullscreen();
		theatreBtn.style.display = "none";
		img.src = "./icons/minimize.svg";
	} else {
		document.exitFullscreen();
		theatreBtn.style.display = "flex";
		img.src = "./icons/maximize.svg";
	}
});

theatreBtn.addEventListener("click", (event) => {
	if (videoPlayerContainer.classList.contains("theatre")) {
		videoPlayerContainer.classList.remove("theatre");
	} else {
		videoPlayerContainer.classList.add("theatre");
	}
});

videoPlayerContainer.addEventListener("transitionend", () => setChaptersHeight());

let currentIndex = 0;
slicedTimelineCon.addEventListener("mousemove", (event) => {
	const parentSize = slicedTimelineCon.getBoundingClientRect();
	const percent = Math.min(Math.max(event.x - parentSize.x), parentSize.width) / parentSize.width;
	chapterTooltip.parentElement.style.minWidth = "unset";
	chapterTooltip.parentElement.style.transform = "translateX(-50%)";
	// console.log(percent * 100);

	let sumOfAllValue = 0;
	const sliderSlicedSpans = sliderSliced.children;
	const timeskipSlicedSpans = timeskipSliced.children;
	// playedSliced.innerHTML = "";

	for (let index = 0; index < sliderSlicedSpans.length; index++) {
		timeskipSlicedSpans[index].classList.remove("past");
		timeskipSlicedSpans[index].classList.remove("active");
	}

	for (let index = 0; index < sliderSlicedSpans.length; index++) {
		let spanValue = parseFloat(sliderSlicedSpans[index].dataset.value);
		timeskipSlicedSpans[index].classList.add("past");
		timeskipSlicedSpans[index].classList.remove("active");
		if (percent * 100 < spanValue) {
			currentIndex = index;
			if (fetchedData) {
				chapterTooltip.parentElement.style.display = "flex";
				let containerSize = chapterTooltip.parentElement.getBoundingClientRect();

				if (containerSize.height > 40) {
					chapterTooltip.parentElement.style.minWidth = "20rem";
				}

				if (containerSize.right > videoPlayer.clientWidth) {
					chapterTooltip.parentElement.style.transform = "translateX(-100%)";
				}

				if (containerSize.left < 96) {
					chapterTooltip.parentElement.style.transform = "translateX(-10%)";
				}

				chapterTooltip.textContent = fetchedData[index].val;
				chapterTooltip.parentElement.style.left = percent * 100 + "%";
			}
			break;
		}
		sumOfAllValue += parseFloat(sliderSlicedSpans[index].style.width.replace("%", ""));
	}

	if (sliderSlicedSpans.length === 0) return;
	let relativeSize = parseFloat(sliderSlicedSpans[currentIndex].style.width.replace("%", ""));
	let spanWidth = ((percent * 100 - sumOfAllValue) / relativeSize) * 100;
	timeskipSlicedSpans[currentIndex].firstElementChild.style.width = spanWidth + "%";
	timeskipSlicedSpans[currentIndex].classList.remove("past");
	timeskipSlicedSpans[currentIndex].classList.add("active");
});

slicedTimelineCon.addEventListener("mouseout", (event) => {
	const sliderSlicedSpans = sliderSliced.children;
	const timeskipSlicedSpans = timeskipSliced.children;
	for (let index = 0; index < sliderSlicedSpans.length; index++) {
		timeskipSlicedSpans[index].classList.remove("past");
		timeskipSlicedSpans[index].classList.remove("active");
	}
	chapterTooltip.textContent = "";
	chapterTooltip.parentElement.style.display = "none";
});

slicedTimelineCon.addEventListener("click", (event) => {
	const parentSize = slicedTimelineCon.getBoundingClientRect();
	const percent = Math.min(Math.max(event.x - parentSize.x), parentSize.width) / parentSize.width;
	videoPlayer.currentTime = percent * videoPlayer.duration;
});

currentIndex = 0;
videoPlayer.addEventListener("timeupdate", (event) => {
	setVidCurrentDuration();

	const sliderSlicedSpans = sliderSliced.children;
	const playedSlicedSpans = playedSliced.children;
	if (sliderSlicedSpans.length !== 0) {
		let sumOfAllValue = 0;
		for (let index = 0; index < sliderSlicedSpans.length; index++) {
			playedSlicedSpans[index].classList.remove("past");
			playedSlicedSpans[index].classList.remove("active");
		}

		for (let index = 0; index < sliderSlicedSpans.length; index++) {
			let currentTime = (event.target.currentTime / videoPlayer.duration) * 100;
			let spanValue = parseFloat(sliderSlicedSpans[index].dataset.value);
			playedSlicedSpans[index].classList.add("past");
			playedSlicedSpans[index].classList.remove("active");
			if (currentTime < spanValue) {
				currentIndex = index;
				break;
			}
			sumOfAllValue += parseFloat(sliderSlicedSpans[index].style.width.replace("%", ""));
		}

		let currentTime = (event.target.currentTime / videoPlayer.duration) * 100;
		let parentSize = parseFloat(sliderSlicedSpans[currentIndex].style.width.replace("%", ""));
		let spanWidth = ((currentTime - sumOfAllValue) / parentSize) * 100;
		playedSlicedSpans[currentIndex].firstElementChild.style.width = spanWidth + "%";
		playedSlicedSpans[currentIndex].classList.remove("past");
		playedSlicedSpans[currentIndex].classList.add("active");
	}
});

const formatter = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });

const formatDuration = (time) => {
	const seconds = Math.floor(time % 60);
	const minutes = Math.floor(time / 60) % 60;
	const hours = Math.floor(time / 3600);

	if (hours === 0) {
		return `${minutes}:${formatter.format(seconds)}`;
	} else {
		return `${hours}:${formatter.format(minutes)}:${formatter.format(seconds)}`;
	}
};

function setVidDuration() {
	vidDuration.textContent = formatDuration(videoPlayer.duration);
}

function setVidCurrentDuration() {
	vidCurrentTime.textContent = formatDuration(videoPlayer.currentTime);
}

// volume
volumeCon.children[0].addEventListener("click", (event) => {
	const rangeInput = volumeCon.children[1];
	if (!videoPlayer.muted) {
		volumeCon.children[0].children[0].src = "./icons/volume-x.svg";
	} else {
		setVolumeIcon(rangeInput);
	}

	videoPlayer.muted = !videoPlayer.muted;
});
volumeCon.children[1].addEventListener("input", (event) => {
	setVolumeIcon(event.target);
	videoPlayer.volume = parseFloat(event.target.value) / 100;
});

function setVolumeIcon(element) {
	if (parseInt(element.value) === 0) {
		volumeCon.children[0].children[0].src = "./icons/volume.svg";
	} else if (parseInt(element.value) > 0 && parseInt(element.value) <= 50) {
		volumeCon.children[0].children[0].src = "./icons/volume-1.svg";
	} else if (parseInt(element.value) >= 51 && parseInt(element.value) <= 100) {
		volumeCon.children[0].children[0].src = "./icons/volume-2.svg";
	}
}
