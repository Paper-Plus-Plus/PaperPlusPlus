/**
 * @fileoverview This file is the entry point for the backend of the application.
 * It contains the express server, image parsing and file creation.
 * Calls the loader.js file to load the language specific compilers.
 * 
 */

// General Imports
const fs = require('fs');
const process = require("process");
const prettier = require("prettier");
const { langRunner, cleanUp } = require('./src/backend/loader');

/**
 * Sleep function
 * @param {*} ms 
 * @returns 
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Vision API
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

// Webserver Imports
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
const PORT = 8080;

/**
 * Parse the text from the image to file
 * @param {*} path
 * @param {*} fileName 
 * @param {*} lang
 */
async function parseFile(lang, filename, path) {
  let [result] = await client.documentTextDetection(path);
  let fullTextAnnotation = result.fullTextAnnotation;

  let parser;
  if (lang == "java") {
    parser = "java";
  } else if (lang == "js") {
    parser = "babel";
  }

  // parse text to proper format
  const parsedText = prettier.format(fullTextAnnotation.text, { parser: "java", tabWidth: 2 });

  // fs write parsedText to java file
  fs.writeFile(`${process.cwd()}/data/exported/${filename}.${lang}`, parsedText, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

app.get("/", cors(), async (req, res) => {
});

app.post("/", (req, res) => {
  console.log("collected data from frontend");
  const { documents } = req.body;
  let data;
  //let lang = documents[0].language;
  let lang = "java";
  documents.forEach(async (document) => {
    let className = document.className;
    let buffer = Buffer.from(document.base64.split(",").pop(), "base64");
    // write image to file
    fs.writeFile(`${process.cwd()}/data/scanned/${className}.jpg`, buffer, (err) => { if (err) { console.log(err) } });
    // read file and parse them to text
    let path = `${process.cwd()}/data/scanned/${className}.jpg`;
    try {
      await parseFile(lang, className, path); // change this to document.language later
    } catch (err) {
      res.send({result: false, output: "error processing files"});
      return console.log("sent data to frontend");
    }
    // write file to task.txt
    if (document.mainMethod) {
      fs.writeFile(`${process.cwd()}/data/exported/task.txt`, `${className}.java*main\n`, (err) => { if (err) { console.log(err) } });
    } else {
      fs.writeFile(`${process.cwd()}/data/exported/task.txt`, `${className}.java\n`, (err) => { if (err) { console.log(err) } });
    }
  });
  setTimeout(async () => {
    console.log("sending data to frontend");
    data = langRunner(lang);
    await sleep(3000)
    console.log(data);
    res.send(data);
    console.log("sent data to frontend");
    cleanUp();
  }, 1000);
});

  
app.listen(PORT, console.log(`Server started on port ${PORT}`));