//click see more
let seeMore = document.querySelectorAll(".button.style-scope.ytd-text-inline-expander")
Array.from(seeMore)[1].click()

//view all
let viewAll = document.querySelectorAll("#text.style-scope.ytd-button-renderer.style-blue-text")
viewAll[0].click()

//get element
let element = Array.from(document.querySelectorAll(".style-scope.ytd-watch-flexy"))
element = element.filter(el => el.id === "panels")[0]

// get items
let items = element.querySelectorAll(".yt-simple-endpoint.style-scope.ytd-macro-markers-list-item-renderer")
items = Array.from(items).filter((el) => el.id === "endpoint")

let data = []
let titleStart = "";
let isRepeated = false
items.map((el, index) => {
    if(isRepeated)
        return false
    //get title
    let title = el.querySelectorAll("h4");
    let titleText = title[0].textContent;

    //get time
    let time = title[0].parentElement.lastElementChild.textContent;

    if(titleStart !== titleText)
        data.push(`${time} ${titleText}\n`);
    else
        isRepeated = true


    if(index === 0)
        titleStart = titleText;
})

document.querySelectorAll("yt-formatted-string.style-scope.ytd-text-inline-expander")[0].append(`\n\n${data.join("")}`)
alert("Scroll to the last part of the video description and copy the timestamps")



// download(JSON.stringify(data), "index.txt")
//
// function download(data, filename) {
//     let file = new Blob([data], {type: 'text/plain'}); // text/plain or application/json
//     if (window.navigator.msSaveOrOpenBlob) // IE10+
//         window.navigator.msSaveOrOpenBlob(file, filename);
//     else { // Others
//         let a = document.createElement("a"),
//             url = URL.createObjectURL(file);
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         setTimeout(function() {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 0);
//     }
// }


