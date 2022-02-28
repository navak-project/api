"use strict";
module.exports = function (mongoose) {
    var mqtt = require('mqtt');
    var host = '192.168.1.212';
    var port = '1883';
    var client = mqtt.connect("mqtt://".concat(host, ":").concat(port));
    client.port = port;
    client.host = host;
    client.on('connect', function () {
        console.log("\uD83D\uDD17 Connected to MQTT: mqtt://".concat(client.host, ":").concat(client.port));
    });
    return client;
};
