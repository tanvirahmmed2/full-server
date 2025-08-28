const app = require("./app");
const connectDB = require("./database/db");
const {serverPort}= require("./secret")

app.listen(serverPort, async() => {
  console.log(`🚀 Server running at http://localhost:${serverPort}`);
  await connectDB()
});
