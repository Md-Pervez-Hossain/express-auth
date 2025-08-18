const fs = require("fs");
const path = require("path")
// sync...
// fs.writeFileSync(path.join(__dirname, "text.txt"), "Hello Javascript")
// async
//fs.writeFile(path.join(__dirname, "text.txt"), "Hi JS", (err) => { })

// console.log("start")
// fs.readFile("./src/files/text.txt", "utf-8", (err, result) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(result)
//   }
// })

console.log("stat")

// console.log("start")
// const res = fs.readFileSync("./src/files/text.txt", "utf-8")
// console.log(res)
// console.log("end")





fs.appendFileSync("./src/files/text.txt", `${Date.now()} hi There\n`)

console.log("stat")

fs.unlink('./src/files/text.txt', (e) => { })

fs.mkdirSync("myDocs/a/b", { recursive: true })