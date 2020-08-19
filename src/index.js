require('dotenv/config');

const puppeteer = require('puppeteer')

main = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.setViewport({ "width": 1200, "height": 1000 })
  await page.goto('https://www.linkedin.com/login/pt?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin')
  await page.waitFor('input[name="session_key"]');
  await page.type('input[name="session_key"]', process.env.LK_USER, { delay: 150 });
  await page.type('input[name="session_password"]', process.env.LK_PASSWORD, { delay: 150 });
  await page.keyboard.press('Enter');
  await page.waitFor(3000);
  await page.goto('https://www.linkedin.com/mynetwork/invitation-manager/');
  await page.waitFor(3000);
  let content = await page.evaluate(() => {
    let divs = [...document.querySelectorAll('ul.mn-invitation-list span.invitation-card__title')];
    document.querySelectorAll('ul.mn-invitation-list button.artdeco-button--secondary').forEach((e) => { e.click() })
    return divs.map((div) => div.textContent.trim());

  });
  for (let i = 0; i < content.length; i++) {
    console.log(content[i] + ', foi adicionado na sua lista.')
  }

  await browser.close();

}

main()