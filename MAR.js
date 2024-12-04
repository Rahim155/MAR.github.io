const mineflayer = require('mineflayer');
const KeepAlive = require("./server"); // تأكد من أن هذه الدالة معرفة وتعمل بشكل صحيح

let bot; // المتغير العام للبوت الأساسي

function createMainBot() {
  bot = mineflayer.createBot({
    host: 'Rahim_go.aternos.me', // عنوان السيرفر
    port:  32631, // منفذ ماين كرافت الافتراضي
    username: "MAR155" // اسم البوت
  });

  // عند تسجيل الدخول
  bot.on('login', () => {
    console.log('تم تسجيل الدخول بنجاح!');
    bot.chat('/gamerule sendCommandFeedback false');
    bot.chat('/gamemode spectator MAR');
    KeepAlive();
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

  // التعامل مع الأحداث
  bot.on('kicked', (reason) => {
    console.log(`تم طرد البوت: ${reason}`);
        createUnbanBot();
     // إنشاء بوت رفع البان بعد 5 ثوانٍ
  });

  bot.on('error', (err) => console.log(`حدث خطأ: ${err}`));
}

// إنشاء بوت جديد لإزالة البان
function createUnbanBot() {
  const unbanBot = mineflayer.createBot({
    host: 'Rahim_155.aternos.me',
    port: 63410,
    username: 'UnbanBot' // اسم مؤقت للبوت لإزالة البان
  });

  unbanBot.on('login', () => {
    console.log('بوت إزالة البان متصل!');
    // التحقق من وجود البوت الأساسي في اللعبة قبل إزالة البان
    if (!bot.players['MAR']) { // إذا كان البوت الرئيسي غير موجود
      unbanBot.chat(`/pardon MAR`); // تنفيذ أمر إزالة البان عن البوت الأساسي

      setTimeout(() => {
        createMainBot(); // إعادة إنشاء البوت الأساسي بعد 5 ثوانٍ
      }, 5000);

      setTimeout(() => {
        unbanBot.end(); // تسجيل الخروج من بوت إزالة البان بعد 10 ثوانٍ
      }, 10000);
    } else {
      console.log('البوت MAR موجود بالفعل في اللعبة، لن نقوم بإزالة البان.');
      unbanBot.end(); // لا داعي للقيام بأي شيء، أغلق بوت إزالة البان
    }
  });

  unbanBot.on('error', (err) => console.log(`خطأ في بوت إزالة البان: ${err}`));
}

// بدء البوت الأساسي
createMainBot();
