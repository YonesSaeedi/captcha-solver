# mellat-captcha-solver

ربات خودکار برای خرید شارژ همراه اول از سایت **باباشارژ** با قابلیت حل خودکار کپچای درگاه بانک ملت (bpm.shaparak.ir).

---

## ویژگی‌ها

- پر کردن خودکار فرم شارژ (موبایل، مبلغ، تأیید قوانین)
- هدایت خودکار به درگاه پرداخت بانک ملت
- حل خودکار کپچا با سرویس [AntiCaptcha](https://anti-captcha.com)
- تشخیص رفرش **دستی** کپچا و حل مجدد آنی بدون نیاز به ریستارت
- ذخیره تصاویر کپچا در پوشه `images/` برای بررسی و آموزش مدل

---

## پیش‌نیازها

- [Node.js](https://nodejs.org) نسخه 18 یا بالاتر
- مرورگر Google Chrome نصب‌شده
- اکانت و API Key از [anti-captcha.com](https://anti-captcha.com)

---

## نصب

```bash
git clone https://github.com/YonesSaeedi/captcha-solver.git
cd mellat-captcha-solver
npm install
```

---

## تنظیمات

فایل `.env.example` را کپی کرده و به `.env` تغییر نام دهید:

```bash
# ویندوز
copy .env.example .env

# لینوکس/مک
cp .env.example .env
```

سپس مقادیر را در `.env` تنظیم کنید:

```env
ANTICAPTCHA_KEY=کلید_API_آنتی‌کپچا
MOBILE=09121234567
PRODUCT_ID=10
HEADLESS=false
```

| متغیر | توضیح |
|-------|-------|
| `ANTICAPTCHA_KEY` | کلید API از پنل anti-captcha.com |
| `MOBILE` | شماره موبایل مقصد برای شارژ |
| `PRODUCT_ID` | `9` = ۳۰هزار تومان &nbsp;/&nbsp; `10` = ۵۰هزار &nbsp;/&nbsp; `11` = ۱۰۰هزار |
| `HEADLESS` | `false` = نمایش مرورگر &nbsp;/&nbsp; `true` = بدون نمایش |

---

## اجرا

```bash
npm start
```

اگر Chrome در مسیر پیش‌فرض نیست:

```powershell
# ویندوز
$env:CHROME_PATH="C:\Path\To\chrome.exe"; node index.js
```

```bash
# لینوکس/مک
CHROME_PATH=/usr/bin/chromium node index.js
```

---

## نحوه کار

```
1. باز شدن مرورگر → رفتن به babasharj.com
2. پر کردن خودکار فرم (موبایل + مبلغ + تیک قوانین)
3. کلیک "ادامه به پرداخت" → "تأیید و پرداخت"
4. هدایت به درگاه بانک ملت (bpm.shaparak.ir)
5. حل خودکار کپچا → وارد کردن جواب در فیلد
6. [منتظر] اگر کپچا را دستی رفرش کنید، ربات آن را آنی حل می‌کند
7. اطلاعات کارت را دستی وارد کرده و پرداخت را نهایی کنید
```

---

## ساختار پروژه

```
├── index.js          # نقطه شروع
├── config.js         # خواندن تنظیمات از .env
├── paymentFlow.js    # منطق فرم و حل کپچا
├── captchaSolver.js  # ارتباط با AntiCaptcha API
├── .env              # تنظیمات شخصی (در گیت نیست)
├── .env.example      # نمونه تنظیمات
├── images/           # تصاویر کپچا ذخیره‌شده (در گیت نیست)
└── package.json
```

---

## استفاده برای آموزش مدل

تصاویر کپچاهای حل‌شده در پوشه `images/` ذخیره می‌شوند. می‌توانید از این داده‌ها برای:
- آموزش مدل OCR اختصاصی (TensorFlow / PyTorch)
- بهبود دقت تشخیص کپچاهای مشابه درگاه‌های ایرانی
- مقایسه خروجی AntiCaptcha با OCR محلی

استفاده کنید.

---

## نکات

- فایل `.env` هرگز در گیت commit نمی‌شود (در `.gitignore` است)
- در صورت خطا، اسکرین‌شات `error-screenshot.png` ذخیره می‌شود
- کپچا بعد از حل در فیلد می‌ماند — اطلاعات کارت را **دستی** وارد کنید
