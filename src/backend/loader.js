/**
 * Calling respective compilers based on the language
 * 
 */
function langRunner(lang) {
  switch (lang) {
    case "java": {
      let javaCompiler = require(".Java/compiler");
      return javaCompiler.compile();
    } 
    //case "js": {
    //  let jsCompiler = require(".JavaScript/compiler");
    //  return jsCompiler.compile();
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
      if (file.includes('.java')) {
        fs.unlink(path.join(`${process.cwd()}/data/exported/`, file), err => {
          if (err) throw err;
        });
      }
      if (file.includes('.txt')) {
        fs.writeFile(`${process.cwd()}/data/exported/task.txt`, "", (err) => {
          if (err) throw err;
        });
      }
    }
  });

  // delete all class files in Backend directory
  fs.readdir(`${process.cwd()}/src/Backend/`, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (file.includes('.class')) {
        fs.unlink(path.join(`${process.cwd()}/src/Backend/`, file), err => {
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

modules.exports = {langRunner, cleanUp};