const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write( 'Введите ваш текст\n');

stdin.on('data', data => {
  if(data.toString().trim() === 'exit'){
    stdout.write('В консоль выводится прощальная фраза и процесс завершается!');
    exit();
  }
  else {
    stream.write(data.toString());
  }
});

process.on('SIGINT', () => {
  stdout.write('В консоль выводится прощальная фраза и процесс завершается!');
  exit();
});