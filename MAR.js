const mineflayer = require('mineflayer');
const KeepAlive = require("./server"); // تأكد من أن هذه الدالة معرفة وتعمل بشكل صحيح

let bot; // المتغير العام للبوت الأساسي
let currentPoint = 0; // نقطة البداية
let interval; // لتخزين معرّف المؤقت

const points = [
  { x: 10, y: 64, z: 80 }, // النقطة 1
  { x: 20, y: 64, z: 80 }, // النقطة 2
  { x: 30, y: 64, z: 80 }, // النقطة 3
  { x: 40, y: 64, z: 80 }  // النقطة 4
];

function createMainBot() {
  bot = mineflayer.createBot({
    host: 'Rahim_go.aternos.me', // عنوان السيرفر
    port: 32631, // منفذ ماين كرافت الافتراضي
    username: "MAR155" // اسم البوت
  });

  bot.once('spawn', () => {
    console.log('تم تسجيل الدخول بنجاح!');
    bot.chat('/gamerule sendCommandFeedback false');
    bot.chat('/gamemode spectator MAR155');
    KeepAlive();
    moveToNextPoint();
  });

  // دالة للتحرك إلى النقطة التالية
  function moveToNextPoint() {
    const point = points[currentPoint];

    bot.setControlState('forward', true); // بدء التحرك للأمام

    interval = setInterval(() => {
      const dx = point.x - bot.entity.position.x;
      const dz = point.z - bot.entity.position.z;

      if (Math.abs(dx) < 1 && Math.abs(dz) < 1) {
        bot.setControlState('forward', false); // إيقاف الحركة
        clearInterval(interval); // مسح المؤقت
        currentPoint = (currentPoint + 1) % points.length; // تحديث النقطة التالية
        setTimeout(moveToNextPoint, 2000); // الانتقال إلى النقطة التالية بعد 2 ثوانٍ
      }
    }, 100); // فحص كل 100 ملي ثانية
  }

  bot.on('kicked', (reason) => {
    console.log(`تم طرد البوت: ${reason}`);
    clearInterval(interval); // مسح المؤقت عند الطرد
    createUnbanBot(); // إنشاء بوت رفع البان بعد 5 ثوانٍ
  });

  bot.on('error', (err) => {
    console.log(`حدث خطأ: ${err}`);
    clearInterval(interval); // مسح المؤقت عند حدوث خطأ
  });
}

function createUnbanBot() {
  const unbanBot = mineflayer.createBot({
    host: 'Rahim_go.aternos.me', // عنوان السيرفر
    port: 32631,
    username: 'UnbanBot' // اسم مؤقت للبوت لإزالة البان
  });

  unbanBot.on('login', () => {
    console.log('بوت إزالة البان متصل!');
    if (!bot.players['MAR155']) { // إذا كان البوت الرئيسي غير موجود
      unbanBot.chat(`/pardon MAR155`); // تنفيذ أمر إزالة البان عن البوت الأساسي
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

  unbanBot.on('error', (err) => {
    console.log(`خطأ في بوت إزالة البان: ${err}`);
  });
}

createMainBot();
