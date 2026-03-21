const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/login');
  
  // Fill email
  await page.fill('input[type="email"]', 'admin@example.com');
  // Fill password
  await page.fill('input[type="password"]', 'admin123');
  
  // click submit
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000);
  
  const currentUrl = page.url();
  console.log('Final URL:', currentUrl);
  
  // check for errors on page
  const pageContent = await page.content();
  const errorMatch = pageContent.match(/error/i);
  console.log('Error found on page:', !!errorMatch);
  
  await browser.close();
})();
