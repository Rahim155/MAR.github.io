const mineflayer = require('mineflayer');
const KeepAlive = require("./server"); // تأكد من أن هذه الدالة معرفة وتعمل بشكل صحيح

let bot; // المتغير العام للبوت الأساسي
let currentPoint = 0; // نقطة البداية
let movingInterval; // متغير للتأكد من توقف الحركة عند الحاجة

const points = [
  { x: 10, y: 64, z: 80 }, // النقطة 1
  { x: 20, y: 64, z: 80 }, // النقطة 2
  { x: 30, y: 64, z: 80 }, // النقطة 3
  { x: 40, y: 64, z: 80 }  // النقطة 4
];

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
    bot.chat('/gamemode spectator MAR155');
    KeepAlive();
    moveToNextPoint();
  });

  // دالة للتحرك إلى النقطة التالية
  function moveToNextPoint() {
    const point = points[currentPoint];
    moveToPoint(point);
  }

  // دالة للتحرك نحو نقطة معينة
  function moveToPoint(point) {
    clearInterval(movingInterval); // تأكد من عدم وجود أي حركات معلقة
    const distance = 1; // المسافة التي يتحركها البوت في كل خطوة
    const speed = 100; // سرعة الحركة (كل 100 ملي ثانية)

    movingInterval = setInterval(() => {
      const dx = point.x - bot.entity.position.x;
      const dz = point.z - bot.entity.position.z;

      if (Math.abs(dx) < distance && Math.abs(dz) < distance) {
        clearInterval(movingInterval);
        currentPoint = (currentPoint + 1) % points.length; // تحديث النقطة التالية
        setTimeout(moveToNextPoint, 2000); // الانتقال إلى النقطة التالية بعد 2 ثوانٍ
        return;
      }

      if (dx > 0) bot.setControlState('right', true);
      else if (dx < 0) bot.setControlState('left', true);
      else bot.setControlState('right', false), bot.setControlState('left', false);

      if (dz > 0) bot.setControlState('forward', true);
      else if (dz < 0) bot.setControlState('back', true);
      else bot.setControlState('forward', false), bot.setControlState('back', false);
    }, speed);
  }

  // التعامل مع الأحداث
  bot.on('kicked', (reason) => {
    console.log(`تم طرد البوت: ${reason}`);
    createUnbanBot(); // إنشاء بوت رفع البان بعد 5 ثوانٍ
  });

  bot.on('error', (err) => console.log(`حدث خطأ: ${err}`));
}

// إنشاء بوت جديد لإزالة البان
function createUnbanBot() {
  const unbanBot = mineflayer.createBot({
    host: 'Rahim_go.aternos.me', // عنوان السيرفر
    port:  32631,
    username: 'UnbanBot' // اسم مؤقت للبوت لإزالة البان
  });

  unbanBot.on('login', () => {
    console.log('بوت إزالة البان متصل!');
    // التحقق من وجود البوت الأساسي في اللعبة قبل إزالة البان
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

  unbanBot.on('error', (err) => console.log(`خطأ في بوت إزالة البان: ${err}`));
}

// بدء البوت الأساسي
createMainBot();
