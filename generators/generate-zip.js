"use strict";
const pack = require("../package.json");
const zipFolder = require("zip-folder");
const path = require("path");

const extensionName = `Follow-Cursor-${pack.version}`;
const project = path.resolve(__dirname, `../build/${extensionName}`);
const exportZip = path.resolve(__dirname, `../build/${extensionName}.zip`);

zipFolder(project, exportZip, err => {
    if (err) {
        console.error(err);
    } else {
        console.log("Extension zipped!");
    }
});