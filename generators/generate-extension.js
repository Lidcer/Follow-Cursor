"use strict";
const pack = require("../package.json");
const manifest = require("../src/manifest.template.json");
const _ = require("lodash");
// @ts-check
const fs = require("fs-extra");
const path = require("path");

let extensionName = `Follow-Cursor-${pack.version}`;

const css = path.resolve(__dirname, "../src/assets/css");
const images = path.resolve(__dirname, "../src/assets/images");
const html = path.resolve(__dirname, "../src/assets/html");
const jsPath = path.resolve(__dirname, "../src/assets/scripts");

const build = path.resolve(__dirname, "../build");
const extVersion = path.resolve(__dirname, `../build/${extensionName}`);
const manifestFile = path.resolve(
    __dirname,
    `../build/${extensionName}/manifest.json`
);
const assets = path.resolve(__dirname, `../build/${extensionName}/assets/`);
const js = path.resolve(__dirname, `../build/${extensionName}/assets/scripts`);
const cssBuild = path.resolve(
    __dirname,
    `../build/${extensionName}/assets/css`
);
const imagesBuild = path.resolve(
    __dirname,
    `../build/${extensionName}/assets/images`
);
const htmlBuild = path.resolve(
    __dirname,
    `../build/${extensionName}/assets/html`
);

async function start() {
    const web_accessible_resources = await webAccessibleResources();
    manifest.web_accessible_resources = web_accessible_resources;
    manifest.version = pack.version;
    manifest.description = pack.description;

    if (!(await fs.existsSync(build))) await fs.mkdirSync(build);
    if (!(await fs.existsSync(extVersion))) await fs.mkdirSync(extVersion);
    if (!(await fs.existsSync(assets))) await fs.mkdirSync(assets);
    if (!(await fs.existsSync(js))) await fs.mkdirSync(js);
    await fs.writeFileSync(manifestFile, JSON.stringify(manifest));

    await fs.copySync(css, cssBuild);
    await fs.copySync(images, imagesBuild);
    await fs.copySync(html, htmlBuild);
    console.log("Extension generated");
}
async function webAccessibleResources() {
    let web_accessible_resources = [];
    try {
        web_accessible_resources.push(await readDir(css, "css"));
        web_accessible_resources.push(await readDir(images, "images"));
    } catch (error) {
        throw new Error(error);
    }
    web_accessible_resources = _.flatten(web_accessible_resources);
    return web_accessible_resources;
}

function readDir(thisPath, type) {
    return new Promise((resolve, reject) => {
        fs.readdir(thisPath, (err, data) => {
            if (err) return reject(err);
            const files = [];
            data.forEach(file => {
                files.push(`assets/${type}/${file}`);
            });
            resolve(files);
        });
    });
}

start();