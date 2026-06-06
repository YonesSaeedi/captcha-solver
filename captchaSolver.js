const ac = require('@antiadmin/anticaptchaofficial');
const fs = require('fs');
const path = require('path');
const { ANTICAPTCHA_KEY } = require('./config');

ac.setAPIKey(ANTICAPTCHA_KEY);

const IMAGES_DIR = path.join(__dirname, 'images');

async function solveCaptchaFromPage(page, attemptNumber = 1) {
  // اسکرین‌شات مستقیم از المان تصویر کپچا روی صفحه
  const imgElement = await page.$('#captcha-img');
  if (!imgElement) throw new Error('المان کپچا پیدا نشد');

  const screenshotBuffer = await imgElement.screenshot({ type: 'jpeg' });

  // ذخیره برای بررسی
  const imgPath = path.join(IMAGES_DIR, `captcha_attempt${attemptNumber}_${Date.now()}.jpg`);
  fs.writeFileSync(imgPath, screenshotBuffer);
  console.log(`💾 تصویر ذخیره شد: ${path.basename(imgPath)}`);

  const imageBase64 = screenshotBuffer.toString('base64');

  console.log('📤 ارسال به AntiCaptcha...');
  const text = await ac.solveImage(imageBase64, true);

  if (!text) throw new Error('AntiCaptcha پاسخ نداد');

  const result = text.trim();
  console.log(`✅ کپچا حل شد: ${result}`);
  return result;
}

module.exports = { solveCaptchaFromPage };
