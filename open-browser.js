const open = require("open");

const openBrowser = async () => {
    console.log("\n******************************************************************************************************************\n");
    console.log("*  Do not close this window. This is required to open the app without manually running the scripts you bleep!!!  *\n");
    console.log("******************************************************************************************************************\n");
    // Opens the URL in a specified browser.
    await open('http://127.0.0.1:8080/', { app: { name: open.apps.edge } });


}

openBrowser()