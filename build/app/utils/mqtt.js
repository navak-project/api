"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stations = exports.areas = exports.lanterns = exports.client = exports.connectMqtt = void 0;
var mqtt = require('mqtt');
var client;
exports.client = client;
var lanterns;
exports.lanterns = lanterns;
var areas;
exports.areas = areas;
var stations;
exports.stations = stations;
function connectMqtt() {
    var host = '192.168.1.212';
    var port = '1883';
    exports.client = client = mqtt.connect("mqtt://".concat(host, ":").concat(port));
    exports.lanterns = lanterns = mqtt.connect("mqtt://".concat(host, ":").concat(port));
    exports.areas = areas = mqtt.connect("mqtt://".concat(host, ":").concat(port));
    exports.stations = stations = mqtt.connect("mqtt://".concat(host, ":").concat(port));
    client.on('connect', function () {
        console.log("\uD83D\uDD17 Connected to MQTT: mqtt://".concat(host, ":").concat(port));
    });
}
exports.connectMqtt = connectMqtt;
