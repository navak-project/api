var mqtt = require('mqtt');

let client : any;

export function connectMqtt() {
    const host = '192.168.1.212';
    const port = '1883';
    client = mqtt.connect(`mqtt://${host}:${port}`);
    client.port = port;
    client.host = host;
    client.on('connect', function () {
      console.log(`🔗 Connected to MQTT: mqtt://${client.host}:${client.port}`);
    });
}

export { client };