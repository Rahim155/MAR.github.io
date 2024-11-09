const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'Rahim_155.aternos.me', // عنوان السيرفر
  port: 63410, // منفذ ماين كرافت الافتراضي
  username: 'MAR' // اسم البوت
});

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
  const range = 10; // نطاق الحركة العشوائية حول البوت

  // اختيار إحداثيات عشوائية حول الموقع الحالي
  const x = bot.entity.position.x + (Math.floor(Math.random() * range * 2) - range);
  const z = bot.entity.position.z + (Math.floor(Math.random() * range * 2) - range);
  const y = bot.entity.position.y; // الحفاظ على الارتفاع الحالي

  // التحرك إلى الموقع العشوائي
  bot.chat(`أنا ذاهب إلى موقع عشوائي: ${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}`);
  console.log(`أنا ذاهب إلى موقع عشوائي: ${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}`);

  // تحريك البوت إلى الموقع العشوائي
  bot.setControlState('forward', true); // التحرك للأمام
  setTimeout(() => bot.setControlState('forward', false), 5000); // إيقاف الحركة بعد 5 ثوانٍ
}

// جعل البوت يتحرك عشوائياً كل 5 ثوانٍ


// التعامل مع الأحداث
bot.on('kicked', (reason) => console.log(`تم طرد البوت: ${reason}`));
bot.on('error', (err) => console.log(`حدث خطأ: ${err}`));
