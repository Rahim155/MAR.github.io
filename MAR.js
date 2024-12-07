const mineflayer = require('mineflayer');
//const KeepAlive = require("./server"); // تأكد من أن هذه الدالة معرفة وتعمل بشكل صحيح

let bot; // المتغير العام للبوت الأساسي

function createMainBot() {
  bot = mineflayer.createBot({
    host: 'Rahim_go.aternos.me', // عنوان السيرفر
    port:  32631, // منفذ ماين كرافت الافتراضي
    username: "MAR" // اسم البوت
  });

  // عند تسجيل الدخول
  bot.on('login', () => {
    console.log('تم تسجيل الدخول بنجاح!');
    bot.chat('/gamerule sendCommandFeedback false');
    bot.chat('/gamemode survival MAR');
    //KeepAlive();
    setInterval(() => {
        moveRandomly();
     
    }, 20000); // التحرك العشوائي كل 5 ثوانٍ
  });

  // وظيفة لاختيار إحداثيات عشوائية حول موقع البوت الحالي والتحرك إليها
  function moveRandomly() {
     bot.chat('/teleport MAR 10 30000 80');
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
    host: 'Rahim_go.aternos.me',
    port: 32631,
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
