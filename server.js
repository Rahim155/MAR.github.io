const express = require("express");
const server = express();
server.all("/",(req,res) => {
  res.send("BOT is Alive");
  })
function KeepAlive()
{
 const PORT = process.env.PORT || 10000; // لتحديد المنفذ من البيئة أو استخدام 10000 كمنفذ افتراضي
server.listen(PORT, () => {
  console.log(`Server is ready on port ${PORT}`);
});
}
module.exports = KeepAlive;
