'use strict';

const fs = require('fs');
const path = require('path');
const md5 = require('md5')
const uuid = require('uuid').v4;
const folderPath = process.argv[2];

if (! folderPath) {
    console.error('Error: File path must be specified in CLI; terminating script.');
    return;
} else if (! fs.existsSync(folderPath)) {
    console.error('Error: The specified folder doesn\'t exit.');
    console.log(`Provided path: ${folderPath}`);
    return;
}

const getAllFiles = function(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
        }
    })

    return arrayOfFiles
}


const result = getAllFiles(folderPath);


result.forEach((file) => {
    let fullDirPath = file.split(path.sep);
    const fileParts = fullDirPath.pop().split('.');
    fullDirPath = fullDirPath.join(path.sep) + path.sep;
    const fileName = fileParts[0];
    const fileExt = fileParts[1];
    const newWritePath = fullDirPath.replace(folderPath, folderPath + '-modified');
    const newFileName = `${md5(uuid())}.${fileExt}`;

    // console.log(newFileName);
    // console.log(fileName);

    const destPath = newWritePath + newFileName;

    if (! fs.existsSync(destPath)) {
        fs.mkdirSync(newWritePath, { recursive: true });
    }

    fs.copyFile(file, destPath, (error) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log('file written successfully', newFileName);
        }
    });

});

// console.log(result)