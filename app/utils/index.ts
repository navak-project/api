const colorsys = require('colorsys');
import ping from 'ping';
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
	const address = `${ip}:${process.env.PORT}`
	try {
		const server = await db.servers.findOne({ ipAddress: address });
		if (server) {
			console.log(`${address} is already registered.`);
			return
		} else {
			const newServer = new db.servers({name:process.env.NAME, ipAddress: address , status: true });
			await newServer.save();
			console.log(`${address} has been register.`);
		}
	} catch (err) {
		console.log(err);
	}
}

/**
 * Ping lantern to check status
 */
export async function pingLanterns() {
	var query = {status: true};
	var pingcfg = {
		timeout: 2,
		extra: ['-i', '2']
	};
	try {
		const allLanterns = await db.lanterns.find(query);
		allLanterns.forEach((lantern: any) => {
			ping.sys.probe(
				lantern['ipAddress'],
				async (status: any) => {
					await db.lanterns.findOneAndUpdate(query, {"status": status});
					if (!status) {
						console.log(`🔴 Lantern [ID: ${lantern.id} | IP: ${lantern.ipAddress} | MAC: ${lantern.macAddress}] is Offline!`);
					} else {
						console.log(`🟢 Lantern [ID: ${lantern.id} | IP: ${lantern.ipAddress} | MAC: ${lantern.macAddress}] is Offline!`);
					}
				},
				pingcfg
			);
		});
	} catch (error) {
		console.error(error);
	}
}
