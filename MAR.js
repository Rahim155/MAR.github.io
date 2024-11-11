const mineflayer = require('mineflayer');
const KeepAlive = require("./server"); // تأكد من أن هذه الدالة معرفة وتعمل بشكل صحيح
const bot = mineflayer.createBot({
  host: 'Rahim_155.aternos.me', // عنوان السيرفر
  port: 63410, // منفذ ماين كرافت الافتراضي
  username: 'MAR' // اسم البوت
});

// عند تسجيل الدخول
bot.on('login', () => {
  console.log('تم تسجيل الدخول بنجاح!');
 // bot.chat('مرحباً! سأبدأ التحرك بشكل عشوائي.');
  bot.chat('/gamerule sendCommandFeedback false');
  bot.chat('/gamemode spectator MAR');
  setInterval(() => {
    if (bot.entity.onGround) { // التأكد من أن البوت على الأرض
      moveRandomly();
    }
    bot.chat('/teleport MAR 10 64 80');
  }, 5000); // التحرك العشوائي كل 5 ثوانٍ
});

// وظيفة لاختيار إحداثيات عشوائية حول موقع البوت الحالي والتحرك إليها
function moveRandomly() {
  const y = 64; // الارتفاع الثابت
  const x = bot.entity.position.x + (Math.floor(Math.random() * 20) - 10); // إحداثي عشوائي حول الموقع الحالي
  const z = bot.entity.position.z + (Math.floor(Math.random() * 20) - 10); // إحداثي عشوائي حول الموقع الحالي

  bot.chat(`/teleport ${x} ${y} ${z}`); // استخدام أمر التليبور للتحرك
  bot.setControlState('forward', true); // بدء التحرك للأمام
  setTimeout(() => bot.setControlState('forward', false), 5000); // إيقاف الحركة بعد 5 ثوانٍ
}

// إبقاء البوت متصلاً
KeepAlive();

// التعامل مع الأحداث
bot.on('kicked', (reason) => console.log(`تم طرد البوت: ${reason}`));
bot.on('error', (err) => console.log(`حدث خطأ: ${err}`));
