const puppeteer = require('puppeteer-core');
const { fillChargeForm, solveBankCaptcha } = require('./paymentFlow');
const { HEADLESS } = require('./config');

(async () => {
  // مسیر Chrome نصب‌شده روی ویندوز
  const chromePath =
    process.env.CHROME_PATH ||
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: HEADLESS,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // User-Agent واقعی برای جلوگیری از block شدن
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  try {
    await fillChargeForm(page);
    await solveBankCaptcha(page);

    console.log('\n🎉 فرآیند با موفقیت کامل شد!');
    console.log('صفحه باز است — می‌توانید ادامه پرداخت را دستی انجام دهید.');
  } catch (err) {
    console.error('\n💥 خطای کلی:', err.message);
    await page.screenshot({ path: 'error-screenshot.png' });
    console.log('📸 اسکرین‌شات خطا ذخیره شد: error-screenshot.png');
  }

  // مرورگر را باز نگه می‌داریم برای بررسی دستی
  // await browser.close();
})();
