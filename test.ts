import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AnonymizeUAPlugin from "puppeteer-extra-plugin-anonymize-ua";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
const localChromePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const stealth = StealthPlugin();
stealth.enabledEvasions.delete("iframe.contentWindow");
stealth.enabledEvasions.delete("media.codecs");
puppeteer.use(stealth);
puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(
  AdblockerPlugin({
    blockTrackers: true,
  })
);

(async () => {
  const email = "";
  const password = "";

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
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: true,
    // executablePath: localChromePath,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: null,
  }); // Set headless to false to see the browser
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on("response", (response) => {
    if (response.status() >= 300 && response.status() <= 399) {
      console.log(`Redirect detected: ${response.headers().location}`);
    }
  });
  // Navigate to Google login page
  await page.goto(url);

  await page.waitForSelector('input[type="email"]');
  // Enter the email or phone number
  await page.type('input[type="email"]', email, {
    delay: 100,
  });
  await page.keyboard.press("Enter");
  //   await page.click('button:has-text("Next")');

  await page.screenshot({ path: "example.png" });
  // Wait for the password field to be visible and enter the password
  //   await page.waitForSelector('input[type="password"]', { state: 'visible' });
  await new Promise((r) => setTimeout(r, 5000));

  await page.screenshot({
    path: "example2.png",
  });
  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', password, {
    delay: 30,
  });
  await page.keyboard.press("Enter");

  await page.screenshot({
    path: "example3.png",
  });
  // Wait for navigation to complete
  await new Promise((r) => setTimeout(r, 5000));

  // at this point it will redirect to the url
  // we need to get the actual response that i get from the url
  // and log the response like json

  await page.screenshot({
    path: "example4.png",
  });

  // here it will ask for #headingText > span:nth-child(1)
  // we need to get the text of the element
  const headingText = await page.$("#headingText > span:nth-child(1)");
  const headingTextData = await page.evaluate(
    (el) => el?.textContent,
    headingText
  );
  console.log("headingText", headingTextData);
  console.log("Logged in successfully!");

  await page.screenshot({
    path: "example5.png",
  });

  // await page.waitForNetworkIdle();

  await page.waitForSelector(
    ".tyoyWc > div:nth-child(1) > button:nth-child(1)"
  );

  // click on the button with text "Continue"
  await page.click(".tyoyWc > div:nth-child(1) > button:nth-child(1)");

  await new Promise((r) => setTimeout(r, 5000));

  await page.screenshot({
    path: "example6.png",
  });

  // wait for the url to change
  await page.waitForNavigation({
    waitUntil: "networkidle0",
  });

  // log the url
  const urlData = await page.url();
  console.log("url", urlData);

  // Close the browser
  await browser.close();
})();
