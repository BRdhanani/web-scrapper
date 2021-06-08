const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

dotenv.config();

// Static web scrap
//performing a GET request
axios
  .get(process.env.STATIC)
  .then((response) => {
    //handling the success
    const html = response.data;

    //loading response data into a Cheerio instance
    const $ = cheerio.load(html);

    //selecting the elements with the data
    const scrapedata = $("a", ".comment-bubble").text();

    //outputting the scraped data
    console.log(scrapedata);
  })
  //handling error
  .catch((error) => {
    console.log(error);
  });

// Dynamic web scrap
//initiating Puppeteer
puppeteer
  .launch()
  .then(async (browser) => {
    //opening a new page and navigating to Reddit
    const page = await browser.newPage();
    await page.goto(process.env.DYNAMIC);
    await page.waitForSelector("body");

    //manipulating the page's content
    let grabPosts = await page.evaluate(() => {
      let allPosts = document.body.querySelectorAll(".Post");

      //storing the post items in an array then selecting for retrieving content
      scrapeItems = [];
      allPosts.forEach((item) => {
        let postTitle = item.querySelector("h3").innerText;
        let postDescription = "";
        try {
          postDescription = item.querySelector("p").innerText;
        } catch (err) {}
        scrapeItems.push({
          postTitle: postTitle,
          postDescription: postDescription,
        });
      });
      let items = {
        redditPosts: scrapeItems,
      };
      return items;
    });
    //outputting the scraped data
    console.log(grabPosts);
    //closing the browser
    await browser.close();
  })
  //handling any errors
  .catch(function (err) {
    console.error(err);
  });
