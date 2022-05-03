import {lanterns} from './mqtt';

const colorsys = require('colorsys');
const db = require('../models').db;
/**
 * Get a random RGB color
 * @return {string} return random RGB color
 */
export async function getRandomColor(): Promise<string> {
	var h = 0 + Math.random() * (360 - 0);
	var s = 80 + Math.random() * (100 - 80);
	var v = 80 + Math.random() * (100 - 80);
	const hsvToRgb = await colorsys.hsvToRgb({h: h, s: s, v: v});
	return `${hsvToRgb.r}, ${hsvToRgb.g}, ${hsvToRgb.b}, ${255}`;
}

// register ip to the database servers
export async function register(): Promise<void> {
	var ip = require('ip').address();
	const address = `${ip}:${process.env.PORT}`;
	try {
		const server = await db.servers.findOne({ipAddress: address});
		if (server) {
			console.log(`${address} is already registered.`);
			return;
		} else {
			const newServer = new db.servers({name: process.env.NAME, ipAddress: address, status: true});
			await newServer.save();
			console.log(`${address} has been register.`);
		}
	} catch (err) {
		console.log(err);
	}
}

export async function igniteLanternsTest(): Promise<void> {
	try {
		const lanternsArr = await db.lanterns.find({status: true, picked: false});
		// loop in lanterns each
		lanternsArr.forEach(async (element: any, i: any) => {
			setTimeout(async () => {
				console.log(`lantern ${element.id} is ignited!`);
				element.pulse = randomIntFromInterval(70, 90);;
				element.rgb = await getRandomColor();
				lanterns.publish(`/lanterns/isactive`, JSON.stringify(element));
			}, i * 2000);
		});
	} catch (err) {
		console.log(err);
	}
}

function randomIntFromInterval(min: any, max :any) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}