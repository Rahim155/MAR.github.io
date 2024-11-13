const mineflayer = require('mineflayer');
const KeepAlive = require("./server"); // تأكد من أن هذه الدالة معرفة وتعمل بشكل صحيح
function createMainBot() {
  bot = mineflayer.createBot({
    host: 'Rahim_155.aternos.me', // عنوان السيرفر
    port: 63410, // منفذ ماين كرافت الافتراضي
    username: "MAR" // اسم البوت
  });


// عند تسجيل الدخول
bot.on('login', () => {
  console.log('تم تسجيل الدخول بنجاح!');
 // bot.chat('مرحباً! سأبدأ التحرك بشكل عشوائي.');
  bot.chat('/gamerule sendCommandFeedback false');
  bot.chat('/gamemode spectator MAR');
  KeepAlive();
  setInterval(() => {
    if (bot.entity.onGround) { // التأكد من أن البوت على الأر
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


// التعامل مع الأحداث
 bot.on('kicked', (reason) => {
    console.log(`تم طرد البوت: ${reason}`);
    setTimeout(createUnbanBot, 5000); // إنشاء بوت رفع البان بعد 5 ثوانٍ
  });

bot.on('error', (err) => console.log(`حدث خطأ: ${err}`));

function createUnbanBot() {
  unbanBot = mineflayer.createBot({
    host: 'Rahim_155.aternos.me',
    port: 63410,
    username: 'UnbanBot' // اسم مؤقت للبوت لإزالة البان
  });

  unbanBot.on('login', () => {
    console.log('بوت إزالة البان متصل!');
    unbanBot.chat(`/pardon MAR`); // تنفيذ أمر إزالة البان عن البوت الأساسي

    setTimeout(() => {
      createMainBot(); // إعادة إنشاء البوت الأساسي بعد 5 ثوانٍ
    }, 5000);

    setTimeout(() => {
      unbanBot.end(); // تسجيل الخروج من بوت إزالة البان بعد 5 ثوانٍ
    }, 10000);
  });

  unbanBot.on('error', (err) => console.log(`خطأ في بوت إزالة البان: ${err}`));
}
