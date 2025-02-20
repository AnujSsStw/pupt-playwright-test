import test, { expect } from "@playwright/test";
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import AnonymizeUAPlugin from "puppeteer-extra-plugin-anonymize-ua";

const localChromePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

test.describe("Sing in on home page", async () => {
  test("google login", async () => {
    const stealthPlugin = stealth();
    stealthPlugin.enabledEvasions.delete("iframe.contentWindow");
    stealthPlugin.enabledEvasions.delete("media.codecs");
    chromium.use(stealthPlugin);
    chromium.use(AnonymizeUAPlugin());
    const email = process.env.EMAIL || "";
    const password = process.env.PASSWORD || "";

    // const calendarauth = 'false';
    const localhost = "http://localhost:3000";
    const prodUrl =
      "https://inkrepo-server-git-mobiledevpreview-harshyt-goels-projects.vercel.app";
    const signInUrl = `${prodUrl}/api/signin/google`;
    // const redirectTo = `Inkuapp://login?calendarauth=${calendarauth}`;

    const queryParams = new URLSearchParams({
      "expo-redirect": localhost,
    });

    const url = `${signInUrl}?${queryParams.toString()}`;
    console.log("url", url);
    const browser = await chromium.launch({
      headless: true,
      ignoreDefaultArgs: ["--disable-extensions"],
      // args: [
      //   '--start-maximized', // Start maximized
      //   '--no-sandbox', // May help in some environments
      //   '--disable-web-security', // Not recommended for production use
      //   '--disable-infobars', // Prevent infobars
      //   '--disable-extensions', // Disable extensions
      //   '--window-size=1280,720', // Set a specific window size
      //   '--disable-blink-features=AutomationControlled',
      // ],
      args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: localChromePath,
    });
    const page = await browser.newPage();
    await page.goto(url);

    // Random mouse movement before typing email
    await page.mouse.move(Math.random() * 500, Math.random() * 500, {
      steps: 25,
    });

    await page.waitForSelector('input[type="email"]');
    // Move to email input with some randomization
    const emailInput = await page.$('input[type="email"]');
    const emailBox = await emailInput?.boundingBox();
    if (emailBox) {
      await page.mouse.move(
        emailBox.x + emailBox.width / 2 + (Math.random() * 10 - 5),
        emailBox.y + emailBox.height / 2 + (Math.random() * 10 - 5),
        { steps: 15 }
      );
    }
    await page.type('input[type="email"]', email, { delay: 100 });

    await page.keyboard.press("Enter");
    await page.screenshot({ path: "example.png" });

    // Random mouse movement before password
    await page.mouse.move(Math.random() * 800, Math.random() * 600, {
      steps: 20,
    });

    await page.screenshot({ path: "example2.png" });
    await page.waitForSelector('input[type="password"]', { state: "visible" });
    // Move to password input with some randomization
    const passwordInput = await page.$('input[type="password"]');
    const passwordBox = await passwordInput?.boundingBox();
    if (passwordBox) {
      await page.mouse.move(
        passwordBox.x + passwordBox.width / 2 + (Math.random() * 10 - 5),
        passwordBox.y + passwordBox.height / 2 + (Math.random() * 10 - 5),
        { steps: 15 }
      );
    }
    await page.type('input[type="password"]', password, { delay: 30 });
    await page.screenshot({ path: "example3.png" });

    // Random mouse movement before pressing Enter
    await page.mouse.move(Math.random() * 1000, Math.random() * 700, {
      steps: 30,
    });
    await page.keyboard.press("Enter");

    try {
      // verify the heading text
      await page.waitForSelector("#headingText > span:nth-child(1)", {
        timeout: 5000,
      });
      console.log("Check mobile for verification");

      // continue button
      await page.waitForSelector(
        ".tyoyWc > div:nth-child(1) > button:nth-child(1)"
      );
    } catch (error) {
      console.log("No verification needed");
      await page.waitForSelector(
        ".tyoyWc > div:nth-child(1) > button:nth-child(1)"
      );
    }
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("localhost:3000") && response.status() === 200
    );

    await page.click(".tyoyWc > div:nth-child(1) > button:nth-child(1)");
    console.log("Clicked continue button, waiting for redirect...");

    // await page.waitForURL('http://localhost:3000/', {
    //   timeout: 30000,
    // });
    const response = await responsePromise;

    // Verify response status and content
    if (!response.ok()) {
      console.log(`Redirect failed with status: ${response.status()}`);
    }
    console.log("Redirected to localhost:3000");
    console.log(response.url());
    expect(response.url()).toContain("localhost:3000");
    expect(response.status()).toBe(200);
    const urlData = new URL(response.url());
    const expoRedirectParam = urlData.searchParams.has("session_token");
    expect(expoRedirectParam).toBe(true);

    // await page.waitForURL('**/localhost:3000**');

    // // Parse and check URL parameters
    // const urlData = new URL(page.url());
    // const xyzParam = urlData.searchParams.has('expo-redirect');
    // expect(xyzParam).toBe(true);
  });

  // test('apple login', async () => {
  //   const stealthPlugin = stealth();
  //   stealthPlugin.enabledEvasions.delete('iframe.contentWindow');
  //   stealthPlugin.enabledEvasions.delete('media.codecs');
  //   chromium.use(stealthPlugin);
  //   chromium.use(AnonymizeUAPlugin());

  //   const email = 'anujzzztw';
  //   const password = 'hello world';

  //   const localhost = 'http://localhost:3000';
  //   const prodUrl =
  //     'https://inkrepo-server-git-mobiledevpreview-harshyt-goels-projects.vercel.app';
  //   const signInUrl = `${prodUrl}/api/signin/apple`;

  //   const queryParams = new URLSearchParams({
  //     'expo-redirect': localhost,
  //   });

  //   const url = `${signInUrl}?${queryParams.toString()}`;
  //   console.log('url', url);
  //   const browser = await chromium.launch({
  //     headless: false,
  //     ignoreDefaultArgs: ['--disable-extensions'],
  //     args: [
  //       '--start-maximized', // Start maximized
  //       '--no-sandbox', // May help in some environments
  //       '--disable-web-security', // Not recommended for production use
  //       '--disable-infobars', // Prevent infobars
  //       '--disable-extensions', // Disable extensions
  //     ],
  //   });
  //   const page = await browser.newPage();
  //   await page.goto(url);

  //   // Random mouse movement before typing email
  //   await page.mouse.move(Math.random() * 500, Math.random() * 500, {
  //     steps: 25,
  //   });

  //   await page.waitForSelector('#account_name_text_field');
  //   // Move to email input with some randomization
  //   const emailInput = await page.$('#account_name_text_field');
  //   const emailBox = await emailInput?.boundingBox();
  //   if (emailBox) {
  //     await page.mouse.move(
  //       emailBox.x + emailBox.width / 2 + (Math.random() * 10 - 5),
  //       emailBox.y + emailBox.height / 2 + (Math.random() * 10 - 5),
  //       { steps: 15 },
  //     );
  //   }
  //   await page.type('#account_name_text_field', email, { delay: 100 });
  //   await page.keyboard.press('Enter');

  //   await page.waitForSelector('#password_text_field');
  //   // Move to password input with some randomization
  //   const passwordInput = await page.$('#password_text_field');
  //   const passwordBox = await passwordInput?.boundingBox();
  //   if (passwordBox) {
  //     await page.mouse.move(
  //       passwordBox.x + passwordBox.width / 2 + (Math.random() * 10 - 5),
  //       passwordBox.y + passwordBox.height / 2 + (Math.random() * 10 - 5),
  //       { steps: 15 },
  //     );
  //   }
  //   await page.type('#password_text_field', password, { delay: 500 });
  //   await page.keyboard.press('Enter');
  // });
});
