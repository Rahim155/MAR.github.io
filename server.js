// server.js
const http = require("http");

function KeepAlive() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("BOT is Alive");
  });

  const PORT = process.env.PORT || 10000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = KeepAlive;

