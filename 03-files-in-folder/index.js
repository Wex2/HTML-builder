const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

(async () => {
  const filesName = await fsPromises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});
  const folderPath = path.join(__dirname, 'secret-folder');

  for (let file of filesName) {
    if (file.isFile()) {
      const fileName = file.name.split('.')[0];
      const fileType = path.extname(file.name).slice(1);
      let size;
      fs.stat(path.join(folderPath, file.name), (err, stats) => {
        if (err) {
          console.log(err);
        } else {
          size = stats.size / 1024;
          console.log(`${fileName} - ${fileType} - ${size.toFixed(3)}kb`);
        }
      });
    }
  }
})();