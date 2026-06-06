require('dotenv').config();

module.exports = {
  ANTICAPTCHA_KEY: process.env.ANTICAPTCHA_KEY,
  MOBILE:          process.env.MOBILE,
  // 9=30هزار  10=50هزار  11=100هزار
  PRODUCT_ID:      process.env.PRODUCT_ID || '10',
  HEADLESS:        process.env.HEADLESS === 'true',
};
