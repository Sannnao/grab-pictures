const fs = require('fs');
const path = require('path');
var os = require('os');
const imageSize = require('image-size');

const userName = os.userInfo().username;

const picturesDir = `C:/Users/${userName}/AppData/Local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets`;
const finalDest = `C:/Users/${userName}/Pictures`;

const doMagic = async () => {
  fs.readdir(picturesDir, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    const rawPicturesDir = path.join(__dirname, 'raw-pictures');

    fs.mkdir(rawPicturesDir, { recursive: true }, err => {
      if (err) {
        console.log(err);
        return;
      }
    });

    files.forEach(file => {
      const filePathSrc = path.join(picturesDir, file);
      const filePathDest = path.join(rawPicturesDir, `${file}.jpg`);

      new Promise((res, rej) => {
        fs.copyFile(filePathSrc, filePathDest, err => {
          if (err) {
            rej(err);
            return;
          }

          res(`Copied ${file}`);
        });
      })
        .then(res => {
          console.log(res);

          return imageSize(filePathDest);
        })
        .then(({ width, height }) => {
          if (width === 1920 && height === 1080) {
            const finalDestImg = path.join(finalDest, `${file}.jpg`);

            fs.copyFile(filePathDest, finalDestImg, err => {
              if (err) {
                console.log(err);
                return;
              }

              console.log(`Copied to final dest ${file}`);
            });
          }
        })
        .then(() => {
          fs.unlink(filePathDest, err => {
            if (err) {
              console.log(err);
              return;
            }

            console.log('File deleted!');
          });
        })
        .catch(err => {
          reject(new Error(err));
        });
    });
  });
};

doMagic();
