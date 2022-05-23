const path = require('path');
const fsPromises = require('fs/promises');
const mainFiles = path.join(__dirname, 'files');
const copyFiles = path.join(__dirname, 'files-copy');

async function copyDirectory(mainFiles, copyFiles) {
  await fsPromises.rm(copyFiles, { force: true, recursive: true });
  await fsPromises.mkdir(copyFiles, { recursive: true });

  const filesName = await fsPromises.readdir(mainFiles, { withFileTypes: true });

  for (let item of filesName) {
    const currentFile = path.join(mainFiles, item.name);
    const copyFile= path.join(copyFiles, item.name);

    if (item.isDirectory()) {
      await fsPromises.mkdir(copyFile, { recursive: true });
      await copyDirectory(currentFile, copyFile);
    } else if (item.isFile()) {
      await fsPromises.copyFile(currentFile, copyFile);
    }
  }
}

copyDirectory(mainFiles, copyFiles);