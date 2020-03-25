const fs = require('fs');
const path = require('path');
var os = require('os');
const imageSize = require('image-size');

const userName = os.userInfo().username;

const picturesDir = `C:/Users/${userName}/AppData/Local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets`;
const finalDest = `C:/Users/${userName}/Pictures`;

new Promise((res, rej) => {
  fs.readdir(picturesDir, (err, files) => {
    if (err) {
      rej(err);
    }

    res(files);
  });
})
  .then(files => {
    files.forEach(file => {
      const filePathSrc = path.join(picturesDir, file);
      const filePathDest = path.join(finalDest, `${file}.jpg`);
      const { width, height } = imageSize(filePathSrc);

      if (width === 1920 && height === 1080) {
        fs.copyFile(filePathSrc, filePathDest, err => {
          if (err) {
            console.log(err);
            return;
          }

          console.log(`Copied ${file}`);
        });
      }
    });
  })
  .catch(err => console.log(err));
