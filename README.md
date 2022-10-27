# CHAPTERS
  An offline web-based video player that can be used like YouTube.  
  This project intends to help the programmers whose just started programming and doesn't have stable internet connection to sustain YouTube consumptions.

## Features

- Able to run locally or Offline
- Chapters/Key Moments like YouTube
- Theatre mode
- Fullscreen mode

## Run Locally

Clone the project

```bash
  git clone https://github.com/iAmWayneBenedict/chapters.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  npm run start
```


## FAQ

#### How to add videos?

Copy `Ctrl+C` or move `Ctrl+X` your videos and paste `Ctrl+V` it in `my-project/public/vids`

#### How to play videos?

Click the `browse` button on the top right corner of the app then navigate to the `my-project/public/vids` and choose the video you want to play

#### How to add chapters or key moments?

You can refer to the [Usage/Examples](#usageexamples)



## Usage/Examples

- Copy `Ctrl+C` the timestamps found in the video description.
- Click the `Add chapters` button 
- Paste `Ctrl+V` on the textarea  
- And, click the `Add` button

If there are no timestamps in the video but there are key moments, you can refer to the [Webscraping](#webscraping) 

### Webscraping
Unfortunately only firefox is supported for webscraping key moments, but I'm working on adding Chrome and Edge
### Firefox
Instructions for webscraping key moments
- Open the video you want to webscrape in YouTube
- Wait for the actual video to play
- Copy this code to the developers tool
- Scroll to the bottom part of the video description and copy the timestamps
- Paste it on the app

```javascript
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

```


## Tech Stack

**Client:** HTML, CSS, JavaScript, EJS

**Server:** Node, Express


## License

[MIT](https://choosealicense.com/licenses/mit/)
