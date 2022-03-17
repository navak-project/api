const colorsys = require('colorsys');
import ping from 'ping';
const db = require('../models').db;
var tcpp = require('tcp-ping');
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
	try {
		const allLanterns = await db.lanterns.find();
		allLanterns.forEach(async (lantern: any) => {
      let res = await ping.promise.probe(lantern.ipAddress);
      await db.lanterns.findOneAndUpdate({ id: lantern.id }, { status: res.alive });
      if (res.alive == false) {
        await db.lanterns.findOneAndUpdate({ id: lantern.id }, { pulse: 0, rgb: '0,0,0,255' });
      }
		});
	} catch (error) {
		console.error(error);
	}
}


export async function pingServers() {
	try {
    const allServers = await db.servers.find();
		allServers.forEach(async (server: any) => {
      let res = await ping.promise.probe(server.ipAddress);
      await db.lanterns.findOneAndUpdate({id:server.id}, {"status": res.alive});
		});
	} catch (error) {
		console.error(error);
	}
}

export async function pingStations() {
	try {
		const allStations = await db.stations.find();
    allStations.forEach((station: any) => {
      tcpp.probe(station.ip, 5000, async function(err:any, available:any) {
       	await db.stations.findOneAndUpdate({id:station.id}, {status : available});
      });
		});
	} catch (error) {
		console.error(error);
	}
}