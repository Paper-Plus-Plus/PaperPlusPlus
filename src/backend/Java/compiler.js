/**
 *  Compile the java file and run it
 * 
 * @returns {Object} data
 */
async function compile() {
  let data = {
    result: false,
    output: ""
  }
  await exec(`javac "${process.cwd()}/src/Backend/CompileCode.java" && java -cp .;src/Backend/ src.Backend.CompileCode`, (err, stdout, stderr) => {
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
        data.output = result.join('\n');
      }
    }
  });
  await sleep(3000)
  return data;
}

module.exports = {compile};