const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

async function copyDirectory(mainFiles, copyFiles) {
  await fsPromises.rm(copyFiles, {force: true, recursive: true});
  await fsPromises.mkdir(copyFiles, {recursive: true});

  const filesName = await fsPromises.readdir(mainFiles, {withFileTypes: true});

  for (let item of filesName) {
    const currentFile = path.join(mainFiles, item.name);
    const copyFile = path.join(copyFiles, item.name);

    if (item.isDirectory()) {
      await fsPromises.mkdir(copyFile, {recursive: true});
      await copyDirectory(currentFile, copyFile);
    } else if (item.isFile()) {
      await fsPromises.copyFile(currentFile, copyFile);
    }
  }
}

async function mergeFiles(styleFolder, mainCss) {
  const filesName = await fsPromises.readdir(styleFolder, {withFileTypes: true});
  let bundleCss = [];

  for (let file of filesName) {
    const pathToCurrentFile = path.join(styleFolder, file.name);
    const fileType = path.extname(file.name).slice(1);

    if (fileType === 'css') {
      const stylesCss = await fsPromises.readFile(pathToCurrentFile, 'utf8');
      bundleCss.push(`${stylesCss}\n`);
    }
  }

  await fsPromises.writeFile(mainCss, bundleCss);
}

async function mergeComponents(template, mainHtml, components) {
  let templateHtml = await fsPromises.readFile(template, 'utf-8');
  const filesName = await fsPromises.readdir(components, { withFileTypes: true });

  for (let file of filesName) {
    const componentContent = await fsPromises.readFile(path.join(components, `${file.name}`), 'utf-8');
    const regExp = new RegExp(`{{${(file.name).split('.')[0]}}}`, 'g');
    templateHtml = templateHtml.replace(regExp, componentContent);
  }

  await fsPromises.writeFile(mainHtml, templateHtml);
}

async function createFolder(pathDist) {
  fs.access(pathDist, (error) => {
    if (error) {
      fsPromises.mkdir(pathDist);
    }
  });
}
(async () => {
  const pathDist = path.join(__dirname, 'project-dist');
  await createFolder(pathDist);

  const styleFolder = path.join(__dirname, 'styles');
  const mainCss = path.join(pathDist, 'style.css');
  await mergeFiles(styleFolder, mainCss);

  const pathAssets = path.join(__dirname, 'assets');
  const mainAssets = path.join(pathDist, 'assets');
  await copyDirectory(pathAssets, mainAssets);

  const template = path.join(__dirname, 'template.html');
  const mainHtml = path.join(pathDist, 'index.html');
  const components = path.join(__dirname, 'components');
  await mergeComponents(template, mainHtml, components);
})();