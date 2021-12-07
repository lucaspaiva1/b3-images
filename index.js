const fs = require("fs");
const puppeteer = require("puppeteer");

const scraping = async (currentPage) => {
  console.log(`> Carregando a página ${currentPage}...`);

  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto(
    `https://www.ivalor.com.br/empresas/listagem?p=${currentPage}`
  );

  await page.waitForSelector("#tab_empresas_body tr");

  console.log(`> Carregou a página ${currentPage}.`);

  const result = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll("#tab_empresas_body tr").forEach((row) => {
      const columns = row.querySelectorAll("td");

      const id = columns[0].textContent;
      const img = columns[1].querySelector("img").getAttribute("src");
      const name = columns[2].getAttribute("data-original-title");
      const shortName = columns[2].textContent;
      const fileNames = columns[3].querySelectorAll("a");

      fileNames.forEach((el) => {
        const fileName = el.getAttribute("data-original-title");
        results.push({ id, img, name, shortName, fileName });
      });
    });
    return results;
  });

  await browser.close();

  return result;
};

// SETUP
let companies = [];
const totalPages = 24;

(async () => {
  const promises = [];
  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    await scraping(currentPage).then((results) => {
      results.forEach((result) => {
        companies.push(result);
      });
    });
  }

  let fileData = JSON.stringify(companies);
  fs.writeFileSync("companies.json", fileData);
})();
