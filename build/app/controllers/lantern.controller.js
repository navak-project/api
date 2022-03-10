"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var utils_1 = require("../utils");
var Lantern = models_1.db.lanterns;
var mqtt_1 = require("../utils/mqtt");
var livePosition;
var liveTopic;
var id;
mqtt_1.lanterns.on('message', function (topic, message) {
    livePosition = message.toString();
    liveTopic = topic;
});
mqtt_1.lanterns.unsubscribe("dwm/node/+/uplink/location");
function getData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            mqtt_1.lanterns.subscribe("dwm/node/".concat(id, "/uplink/location"));
            if (liveTopic === "dwm/node/".concat(id, "/uplink/location")) {
                setTimeout(function () {
                    mqtt_1.lanterns.unsubscribe("dwm/node/".concat(id, "/uplink/location"));
                }, 100);
                return [2 /*return*/, { position: livePosition, topic: liveTopic, id: id }];
            }
            return [2 /*return*/];
        });
    });
}
exports.getLivePosition = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mqtt_1.lanterns.unsubscribe("dwm/node/+/uplink/location");
                id = req.params.id;
                return [4 /*yield*/, getData()];
            case 1:
                data = _a.sent();
                res.send(data);
                return [2 /*return*/];
        }
    });
}); };
exports.reboot = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            mqtt_1.lanterns.publish("/lanterns/".concat(req.body.id, "/reboot"), '{"reboot":{"state":1}}');
        }
        catch (err) { }
        res.send("Rebooted ".concat(req.body.id));
        setTimeout(function () {
            mqtt_1.lanterns.publish("/lanterns/".concat(req.body.id, "/reboot"), '{"reboot":{"state":0}}');
        }, 1000);
        return [2 /*return*/];
    });
}); };
exports.flash = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('flash', req.body);
        try {
            mqtt_1.lanterns.publish("/lanterns/".concat(req.body.id, "/flash"), '{"flash":{"state":1}}');
        }
        catch (err) { }
        res.send("Flashed ".concat(req.body.id, " !"));
        setTimeout(function () {
            mqtt_1.lanterns.publish("/lanterns/".concat(req.body.id, "/flash"), '{"flash":{"state":0}}');
        }, 3000);
        return [2 /*return*/];
    });
}); };
exports.resetAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var options_1, allUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                options_1 = { upsert: false };
                return [4 /*yield*/, Lantern.find()];
            case 1:
                allUser = _a.sent();
                allUser.forEach(function (element) { return __awaiter(void 0, void 0, void 0, function () {
                    var thisUser;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Lantern.updateOne({ id: element.id }, { pulse: '0', rgb: '0, 0, 0, 0' }, options_1)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, Lantern.findOne({ id: element.id })];
                            case 2:
                                thisUser = _a.sent();
                                mqtt_1.lanterns.publish("/lanterns/".concat(thisUser.id, "/reset"), JSON.stringify(thisUser));
                                console.log(thisUser);
                                return [2 /*return*/];
                        }
                    });
                }); });
                res.send('All pulse are now set to 0');
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                res.status(500).send({
                    message: error_1
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.reset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Lantern.updateOne({ id: id }, { pulse: '0', rgb: '0, 0, 0, 1' }, { useFindAndModify: false })];
            case 2:
                _a.sent();
                return [4 /*yield*/, Lantern.findOne({ id: id })];
            case 3:
                user = _a.sent();
                mqtt_1.lanterns.publish("/lantern/".concat(user.id, "/audio/extinguish"));
                mqtt_1.lanterns.publish("/lanterns/".concat(user.id, "/reset"), JSON.stringify(user));
                res.send("Lantern ".concat(id, " pulse is now 0!"));
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.log('error', error_2);
                res.status(500).send({
                    message: error_2
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.randomUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var color, filter, allAvailableUser, picked, options, updateDoc, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, utils_1.getRandomColor)()];
            case 1:
                color = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 7]);
                filter = { status: true, pulse: 0, group: req.params.id };
                return [4 /*yield*/, Lantern.find(filter)];
            case 3:
                allAvailableUser = _a.sent();
                if (allAvailableUser.length <= 0) {
                    return [2 /*return*/, res.status(400).send({
                            message: 'No lantern available!'
                        })];
                }
                picked = allAvailableUser[Math.floor(Math.random() * allAvailableUser.length)];
                options = { upsert: true };
                updateDoc = {
                    $set: { rgb: color }
                };
                return [4 /*yield*/, Lantern.updateOne({ _id: picked._id }, updateDoc, options)];
            case 4:
                _a.sent();
                return [4 /*yield*/, Lantern.findById(picked._id)];
            case 5:
                user = _a.sent();
                console.log("🚀 ~ user", user.id);
                res.send(user);
                return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                res.status(500).send({
                    message: error_3
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var element, lantern, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body) {
                    res.status(400).send({ message: 'Content can not be empty!' });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, Lantern.findOne({ macAddress: req.body.macAddress })];
            case 2:
                element = _a.sent();
                if (!(element != null)) return [3 /*break*/, 3];
                console.log("Lantern [ID: ".concat(element.id, " | IP: ").concat(req.body.ipAddress, " | MAC: ").concat(req.body.macAddress, "] already exists"));
                res.send(element);
                return [3 /*break*/, 5];
            case 3:
                lantern = new Lantern({
                    hostName: req.body.hostName,
                    macAddress: req.body.macAddress,
                    ipAddress: req.body.ipAddress
                });
                return [4 /*yield*/, lantern.save(lantern)];
            case 4:
                _a.sent();
                console.log("CREATED Lantern [ID: ".concat(req.body.id, " | IP: ").concat(req.body.ipAddress, "  | MAC: ").concat(req.body.macAddress, "]"));
                res.send(lantern);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                console.error(error_4);
                res.status(500).send({
                    message: error_4
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.findActive = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, allActive, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = { status: true };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Lantern.find(query)];
            case 2:
                allActive = _a.sent();
                res.send(allActive);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error(error_5);
                res.status(500).send({
                    message: error_5
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.findAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title, condition, data, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = req.query.title;
                condition = title ? { title: { $regex: new RegExp(title), $options: 'i' } } : {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Lantern.find(condition)];
            case 2:
                data = _a.sent();
                res.send(data);
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.status(500).send({
                    message: error_6
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.findOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Lantern.findOne({ id: id })];
            case 2:
                user = _a.sent();
                res.send(user);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                res.status(500).send({
                    message: error_7
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Update a User by the id in the request
exports.updateStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, newValues, target, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body) {
                    return [2 /*return*/, res.status(400).send({
                            message: 'Data to update can not be empty!'
                        })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = { macAddress: req.body.macAddress };
                newValues = { status: true };
                return [4 /*yield*/, Lantern.findOneAndUpdate(query, newValues)];
            case 2:
                target = _a.sent();
                console.log("Lantern [ID: ".concat(target.id, " | IP: ").concat(target.ipAddress, " | MAC: ").concat(target.macAddress, "] is Online!"));
                res.send("Lantern ".concat(target['ipAddress'], " is Online!"));
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                console.log('error', error_8);
                res.status(500).send({
                    message: error_8
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, lantern, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body) {
                    return [2 /*return*/, res.status(400).send({
                            message: 'Data to update can not be empty!'
                        })];
                }
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Lantern.updateOne({ id: id }, req.body, { useFindAndModify: false })];
            case 2:
                _a.sent();
                return [4 /*yield*/, Lantern.findOne({ id: id })];
            case 3:
                lantern = _a.sent();
                mqtt_1.lanterns.publish("/lantern/".concat(lantern.id, "/audio/ignite"), lantern.pulse.toString());
                mqtt_1.lanterns.publish("/lanterns/isactive", JSON.stringify(lantern));
                res.send("Lantern ".concat(id, " updated successful!"));
                return [3 /*break*/, 5];
            case 4:
                error_9 = _a.sent();
                console.log('error', error_9);
                res.status(500).send({
                    message: error_9
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Lantern.findByIdAndRemove(id)];
            case 2:
                _a.sent();
                res.send("Lantern ".concat(id, " deleted successful!"));
                return [3 /*break*/, 4];
            case 3:
                error_10 = _a.sent();
                console.log('error', error_10);
                res.status(500).send({
                    message: error_10
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Lantern.deleteMany({})];
            case 1:
                _a.sent();
                res.send("Database deleted successful!");
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                console.log('error', error_11);
                res.status(500).send({
                    message: error_11
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
