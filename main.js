const Jimp = require("jimp");
const fn = require("./functions.js");

Promise.all([
    new Promise((resolve) => Jimp.read("template.png", (err, image) => resolve(image))),
    new Promise((resolve) => Jimp.read("001.jpg", (err, image) => resolve(image))),
    new Promise((resolve) => Jimp.read("002.jpg", (err, image) => resolve(image))),
    //new Promise((resolve) => new Jimp(128, 128, (err, image) => resolve(image))),
]).then(function(images) {
    
    console.time('mask');
    const mask = fn.createMask(images[0].bitmap.data, images[0].bitmap.width, images[0].bitmap.height);
    console.timeEnd('mask');
    
    console.time('template');
    const template = fn.createTemplate(images[1].bitmap.data, 0, 0, images[1].bitmap.width, images[1].bitmap.heigth, mask);
    console.timeEnd('template');
    
    console.time('total');
    let best = { x: null, y: null, value: 999999999 };
    for (let y = 0; y < images[2].bitmap.height - template.height + 1; ++y) {
        for (let x = 0; x < images[2].bitmap.width - template.width + 1; ++x) {
            let value = fn.calculateSqDiff(images[2].bitmap.data, x, y, images[1].bitmap.width, images[1].bitmap.heigth, template, mask, best);
            if (best.x === null || value < best.value) {
                best = { x: x, y: y, value: value };
            }
        }
    }
    console.timeEnd('total');
    
    console.log(best);
    
});