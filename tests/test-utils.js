var fs = require("fs")
var path = require("path")

export const readFixture = (fixture) => {
  return fs.readFileSync(path.join(__dirname, './fixtures/' + fixture)).toString()
}
