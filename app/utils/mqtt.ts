var mqtt = require('mqtt');

let client: any;
let lanterns: any;
let areas: any;
let stations: any;

export function connectMqtt() {
	const host = 'broker.emqx.io';
	const port = '1883';
	client = mqtt.connect(`mqtt://${host}:${port}`);
	lanterns = mqtt.connect(`mqtt://${host}:${port}`);
	areas = mqtt.connect(`mqtt://${host}:${port}`);
	stations = mqtt.connect(`mqtt://${host}:${port}`);

	client.on('connect', function () {
		console.log(`🔗 Connected to MQTT: mqtt://${host}:${port}`);
	});
}

export {client, lanterns, areas, stations};
