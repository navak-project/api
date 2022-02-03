const colorsys = require('colorsys')
const oscClient = require("node-osc");
const client = new oscClient.Client('127.0.0.1', 3333);

const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

export async function pulseOSC(){
    await client.send('/dbUpdate', 1);
    await delay(100)
    await client.send('/dbUpdate', 0);
  }

/**
 * Get a random RGB color
 * @return {string} return random RGB color
 */
 export async function getRandomColor() {
  return new Promise(async (resolve) => {
    var h = 0 + Math.random() * (360 - 0);
    var s = 80 + Math.random() * (100 - 80);
    var v = 80 + Math.random() * (100 - 80);
    const hsvToRgb = await colorsys.hsvToRgb({ h: h, s: s, v: v })
    resolve(`${hsvToRgb.r}, ${hsvToRgb.g}, ${hsvToRgb.b}, ${255}`);
  });
}