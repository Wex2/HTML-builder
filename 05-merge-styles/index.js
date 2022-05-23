const fsPromises = require('fs/promises');
const path = require('path');
const mainFile = path.join(__dirname, 'project-dist', 'bundle.css');
const styleFolder = path.join(__dirname, 'styles');

(async () => {
  const filesName = await fsPromises.readdir(styleFolder, { withFileTypes: true });
  let bundleCss = [];

  for (let file of filesName) {
    const pathToCurrentFile = path.join(styleFolder, file.name);
    const fileType = path.extname(file.name).slice(1);

    if (fileType === 'css') {
      const stylesCss = await fsPromises.readFile(pathToCurrentFile, 'utf8');
      bundleCss.push(`${stylesCss}\n`);
    }
  }

  await fsPromises.writeFile(mainFile, bundleCss);
})();