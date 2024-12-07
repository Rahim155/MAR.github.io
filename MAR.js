const mineflayer = require('mineflayer');
const { setTimeout } = require('timers/promises');
const KeepAlive = require("./server");

// إعدادات البوت
const botOptions = {
    host: 'Rahim_go.aternos.me',
    port: 32631,
    username: 'MAR'
};

// نقاط الحركة
const points = [
    { x: 100, y: 64, z: 100 },
    { x: 150, y: 64, z: 150 },
    { x: 200, y: 64, z: 100 },
    { x: 150, y: 64, z: 50 }
];

let retryCount = 0;
let afterPardonRetryCount = 0;

function createBot() {
    const bot = mineflayer.createBot(botOptions);

    bot.on('spawn', async () => {
      KeepAlive();
        console.log('البوت متصل بنجاح!');
        retryCount = 0; // إعادة ضبط عدد المحاولات عند النجاح
        afterPardonRetryCount = 0; // إعادة ضبط محاولات ما بعد إزالة البان
        let index = 0;

        // الحركة بين النقاط
        while (true) {
            const point = points[index];
            console.log(`التحرك إلى النقطة: (${point.x}, ${point.y}, ${point.z})`);
            try {
                await bot.pathfinder.goto(new bot.pathfinder.goals.GoalBlock(point.x, point.y, point.z));
                index = (index + 1) % points.length; // الانتقال إلى النقطة التالية
            } catch (err) {
                console.error('خطأ أثناء الحركة:', err.message);
            }
        }
    });

    bot.on('end', async () => {
        console.log('تم فصل البوت.');
        if (retryCount < 3) {
            retryCount++;
            console.log(`محاولة إعادة الاتصال (${retryCount}/3)...`);
            await setTimeout(3000); // الانتظار 3 ثواني قبل إعادة المحاولة
            createBot(); // محاولة إعادة الاتصال
        } else if (afterPardonRetryCount < 3) {
            console.log('فشل الاتصال. سيتم إزالة البان...');
            createPardonBot();
        } else {
            console.log('فشل الاتصال نهائيًا بعد كل المحاولات.');
        }
    });

    bot.on('error', (err) => console.error('حدث خطأ في البوت:', err.message));
}

function createPardonBot() {
    const pardonBot = mineflayer.createBot({
        host: 'Rahim_go.aternos.me',
        port: 32631,
        username: 'PardonBot'
    });

    pardonBot.on('spawn', () => {
        console.log('بوت إزالة البان متصل.');
        pardonBot.chat('/pardon MAR'); // تنفيذ أمر إزالة البان
        setTimeout(() => {
            console.log('إزالة البان تمت. محاولة إعادة الاتصال...');
            pardonBot.end(); // قطع اتصال البوت بعد التنفيذ
            retryAfterPardon();
        }, 5000);
    });

    pardonBot.on('end', () => console.log('بوت إزالة البان فصل الاتصال.'));
    pardonBot.on('error', (err) => console.error('خطأ في بوت إزالة البان:', err.message));
}

async function retryAfterPardon() {
    for (let i = 1; i <= 3; i++) {
        console.log(`محاولة إعادة الاتصال بعد إزالة البان (${i}/3)...`);
        createBot();
        await setTimeout(3000); // الانتظار 3 ثوانٍ بين المحاولات
        afterPardonRetryCount++;
        if (afterPardonRetryCount >= 3) {
            console.log('فشل الاتصال بعد إزالة البان.');
            break;
        }
    }
}

createBot();
