var colorsys = require('colorsys')
/**
 * Get a random RGB color
 * @return {string} return random RGB color
 */
async function getRandomColor() {
  return new Promise(async (resolve) => {
    var h = 0 + Math.random() * (360 - 0);
    var s = 80 + Math.random() * (100 - 80);
    var v = 80 + Math.random() * (100 - 80);
    const hsvToRgb = await colorsys.hsvToRgb({ h: h, s: s, v: v })
    resolve(`${hsvToRgb.r}, ${hsvToRgb.g}, ${hsvToRgb.b}, ${255}`);
  });
}

exports.getRandomColor = getRandomColor;