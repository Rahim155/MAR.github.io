// server.js
const http = require("http");

let visitCount = 0; // متغير لتسجيل عدد الزيارات

function KeepAlive() {
  const server = http.createServer((req, res) => {
    visitCount++; // زيادة عدد الزيارات في كل طلب
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("BOT is Alive");
  });

  const PORT = process.env.PORT || 10000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // إرسال عدد الزيارات كل 7 دقائق (420,000 ميلي ثانية)
  setInterval(() => {
    console.log(`عدد مرات دخول الموقع في آخر 7 دقائق: ${visitCount}`);
    visitCount = 0; // إعادة تعيين العدد بعد الإرسال
  }, 420000); // 7 دقائق بالمللي ثانية
}

module.exports = KeepAlive;
