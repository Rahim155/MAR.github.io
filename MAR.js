const mineflayer = require('mineflayer');
const KeepAlive = require("./server");
const bot = mineflayer.createBot({
  host: 'Rahim_155.aternos.me', // عنوان السيرفر
  port: 63410, // منفذ ماين كرافت الافتراضي
  username: 'MAR' //  البوت
});
bot.on('spawn'),() =>{
   setInterval(() => {
    bot.chat("/teleport @s 10 64 80");
  }, 5000);
}
// عند تسجيل الدخول
bot.on('login', () => {
  console.log('تم تسجيل الدخول بنجاح!');
  bot.chat('مرحباً! سأبدأ التحرك بشكل عشوائي.');
  moveRandomly();
  setInterval(() => {
    if (bot.entity.onGround) { // التأكد من أن البوت على الأرض
      moveRandomly();
    }
  }, 1000);
});

// وظيفة لاختيار إحداثيات عشوائية حول موقع البوت الحالي والتحرك إليها
function moveRandomly() {
  // تحديد حدود المربع للحركة العشوائية
  
  const y = 64; // الارتفاع الثابت

  // اختيار إحداثيات عشوائية ضمن حدود المربع
  const x = 20;
  const z = 100;

  // إرسال رسالة في الدردشة بالموقع العشوائي الذي سيتوجه إليه البوت
  //bot.chat(`أنا ذاهب إلى موقع عشوائي داخل المربع: ${x}, ${y}, ${z}`);
  
  // تحريك البوت إلى الموقع العشوائي
  bot.setControlState('forward', true); // بدء التحرك للأمام
  setTimeout(() => bot.setControlState('forward', false), 5000); // إيقاف الحركة بعد 5 ثوانٍ
}


// جعل البوت يتحرك عشوائياً كل 5 ثوانٍ
KeepAlive();

// التعامل مع الأحداث
bot.on('kicked', (reason) => console.log(`تم طرد البوت: ${reason}`));
bot.on('error', (err) => console.log(`حدث خطأ: ${err}`));
