const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const process = require("process");

/**
 *  Compile the java file and run it
 * 
 * @returns {Object} data
 */
function JavaCompiler() {
  let data = {
    result: false,
    output: ""
  }
  exec(`javac "${process.cwd()}/src/backend/Java/CompileCode.java" && java -cp ./ src.backend.Java.CompileCode`, (err, stdout, stderr) => {
    if (err) throw err;

    // the *entire* stdout and stderr (buffered)
    if (stderr) {
      data.result = false;
      data.output = stderr;
    } else {
      let result = stdout.split('\n');
      if (result[0] != "false") {
        data.result = true;
        data.output = stdout;
      } else {
        result.shift();
        data.result = false;
        data.output = result.join('\n').trim();
      }
    }
  });
  return data;
}

/**
 * Calling respective compilers based on the language
 * 
 */
function langRunner(lang) {
  switch (lang) {
    case "java": {
      return JavaCompiler();
    } 
    //case "js": {
    //  return JSCompiler();
    //}
  }
}

/**
 * Clean up the data directory
 * 
 */
function cleanUp() {
  // delete all image files in scanned and exported directory
  fs.readdir(`${process.cwd()}/data/scanned/`, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (file.includes('.jpg')) {
        fs.unlink(path.join(`${process.cwd()}/data/scanned/`, file), err => {
          if (err) throw err;
        });
      }
    }
  });

  // delete all files in exported directory
  fs.readdir(`${process.cwd()}/data/exported/`, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      //if (file.includes('.java')) {
      //  fs.unlink(path.join(`${process.cwd()}/data/exported/`, file), err => {
      //    if (err) throw err;
      //  });
      //}
      if (file.includes('.txt')) {
        fs.writeFile(`${process.cwd()}/data/exported/task.txt`, "", (err) => {
          if (err) throw err;
        });
      }
    }
  });

  // delete all class files in Backend directory
  fs.readdir(`${process.cwd()}/src/backend/Java`, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (file.includes('.class')) {
        fs.unlink(path.join(`${process.cwd()}/src/backend/Java`, file), err => {
          if (err) throw err;
        });
      }
    }
  });

  // delete all files in User directory
  fs.readdir(`${process.cwd()}/src/user/`, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (!file.includes('placeholder')) {
        fs.unlink(path.join(`${process.cwd()}/src/user/`, file), err => {
          if (err) throw err;
        });
      }
    }
  });

  console.log("Janitor is done cleaning up!");
}

module.exports = {langRunner, cleanUp};