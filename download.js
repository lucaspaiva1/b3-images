const imageDownloader = require("image-downloader");
const fs = require("fs");

const downloadAndSave = async (url, fileName) => {
  return imageDownloader.image({
    url: url,
    dest: `./downloads/${fileName}`,
  });
};

(async () => {
  console.log("Starting...");

  const fileData = fs.readFileSync("companies.json");

  const companies = JSON.parse(fileData);

  for (let company of companies) {
    console.log(`> Downloading image for ${company.fileName}...`);
    try {
      await downloadAndSave(company.img, `${company.fileName}.png`);
    } catch (error) {
      console.log(error);
    }
  }
})();
