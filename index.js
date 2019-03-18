const https = require("https");
const fs = require("fs");
const childProcess = require("child_process");
const endpoint = "https://source.unsplash.com/collection/327760/1920x1080";

const get = link => {
  return new Promise((resolve, reject) => {
    https.get(link, resp => {
      let data = [];

      resp.on("data", chunk => {
        data.push(chunk);
      });

      resp.on("end", () => {
        resolve(Buffer.concat(data));
      });
    });
  });
};

const random = () => {
  get(endpoint).then(buffer => {
    const link = buffer
      .toString()
      .split(`href="`)[1]
      .split(`">`)[0];

    console.log(`[${new Date().toString()} Setting Random Wallpaper...]`);

    get(link)
      .then(buffer => {
        if (!fs.existsSync("./wallpapers")) {
          fs.mkdirSync("./wallpapers");
        }

        const filename = `./wallpapers/${Date.now()}.jpg`;
        fs.writeFileSync(`${filename}`, buffer);
        childProcess.exec(`win-wallpaper.exe ${filename}`);
      })
      .catch(err => {
        console.log(err);
      });
  });
};

console.log("[Welcome to Random Wallpaper~]");
console.log(
  "[This software will set your background randomly every 1 minute.]"
);
console.log(
  "[You can change the frequency by passing in the interval before starting the software.]"
);

console.log(
  "======================================================================================"
);
random();

setInterval(random, process.argv[2] ? process.argv[2] : 60000);
