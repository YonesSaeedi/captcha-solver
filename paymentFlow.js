const { solveCaptchaFromPage } = require('./captchaSolver');
const { MOBILE, PRODUCT_ID } = require('./config');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fillChargeForm(page) {
  console.log('🔄 در حال بارگذاری صفحه...');
  await page.goto('https://babasharj.com/HamrahAval/Charge', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  await page.waitForSelector('#charge-mobile');
  await page.type('#charge-mobile', MOBILE, { delay: 80 });
  console.log(`📱 موبایل وارد شد: ${MOBILE}`);

  await page.select('#charge-product', PRODUCT_ID);
  console.log(`💰 مبلغ انتخاب شد (ProductId: ${PRODUCT_ID})`);

  await page.click('#charge-terms');
  console.log('☑️  قوانین تأیید شد');

  await sleep(500);
  await page.click('#charge-btn-next');
  console.log('➡️  کلیک روی "ادامه به پرداخت"');

  await page.waitForSelector('#charge-btn-pay', { visible: true, timeout: 10000 });
  await sleep(800);

  await page.click('#charge-btn-pay');
  console.log('✅ کلیک روی "تأیید و پرداخت"');
}

async function enterCaptchaValue(page, value) {
  await page.evaluate((val) => {
    const input = document.getElementById('inputcaptcha');
    // غیرفعال کردن موقت focusNextField تا مقدار کامل وارد شود
    const origOnKeyUp = input.onkeyup;
    input.onkeyup = null;
    input.value = val;
    input.onkeyup = origOnKeyUp;
    // fire change برای اطمینان از ثبت مقدار
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);

  await sleep(200);
  const actual = await page.$eval('#inputcaptcha', el => el.value);
  console.log(`✏️  وارد شد: "${value}" — در فرم: "${actual}"`);
}

async function solveBankCaptcha(page) {
  // صبر برای redirect به درگاه
  await page.waitForSelector('#captcha-img', { timeout: 20000 });
  console.log('🏦 وارد درگاه بانک ملت شدیم');

  // کلیک روی وسط صفحه تا فرم نمایش داده شود
  await sleep(1000);
  await page.mouse.click(700, 400);
  console.log('🖱️  کلیک روی صفحه برای نمایش فرم');
  await sleep(800);

  // حل کپچای اولیه
  await solveCurrentCaptcha(page);

  // نظارت بر تغییر src تصویر کپچا (وقتی کاربر دستی رفرش می‌کند)
  console.log('\n👁️  منتظر رفرش دستی کپچا توسط شما هستم...');
  await watchForCaptchaRefresh(page);
}

async function solveCurrentCaptcha(page) {
  // صبر برای لود کامل تصویر
  await page.waitForFunction(
    () => {
      const img = document.getElementById('captcha-img');
      return img && img.complete && img.naturalWidth > 0;
    },
    { timeout: 10000 }
  );

  const captchaText = await solveCaptchaFromPage(page);
  await enterCaptchaValue(page, captchaText);
}

async function watchForCaptchaRefresh(page) {
  // تزریق MutationObserver برای تشخیص تغییر src کپچا
  await page.evaluate(() => {
    window.__captchaChanged = false;
    window.__captchaPrevSrc = document.getElementById('captcha-img').src;

    const observer = new MutationObserver(() => {
      const newSrc = document.getElementById('captcha-img').src;
      if (newSrc !== window.__captchaPrevSrc) {
        window.__captchaChanged = true;
        window.__captchaPrevSrc = newSrc;
      }
    });

    observer.observe(document.getElementById('captcha-img'), {
      attributes: true,
      attributeFilter: ['src'],
    });
  });

  // حلقه بی‌نهایت — هر بار که کاربر رفرش می‌زند
  while (true) {
    await sleep(100);

    const changed = await page.evaluate(() => {
      if (window.__captchaChanged) {
        window.__captchaChanged = false;
        return true;
      }
      return false;
    });

    if (changed) {
      console.log('\n🔄 رفرش کپچا تشخیص داده شد — در حال حل...');
      await solveCurrentCaptcha(page);
      console.log('👁️  منتظر رفرش بعدی هستم...');
    }
  }
}

module.exports = { fillChargeForm, solveBankCaptcha };
