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
var mqtt_1 = require("../utils/mqtt");
var Area = models_1.db.areas;
var toolPosition;
mqtt_1.areas.subscribe('dwm/node/d491/uplink/location');
mqtt_1.areas.on('message', function (topic, message) {
    if (topic === 'dwm/node/d491/uplink/location') {
        toolPosition = message.toString();
    }
});
exports.getToolPosition = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        //console.log("🚀 ~ file: position.controller.ts ~ line 14 ~ exports.getPosition= ~ currentPosition", toolPosition);
        res.send(toolPosition);
        return [2 /*return*/];
    });
}); };
exports.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var position, existing, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body) {
                    res.status(400).send({
                        message: 'Content can not be empty!'
                    });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                position = new Area({
                    id: req.body.id,
                    name: req.body.name,
                    x: req.body.x,
                    y: req.body.y,
                    z: req.body.z,
                    size: req.body.size
                });
                return [4 /*yield*/, Area.findOne({ id: req.body.id })];
            case 2:
                existing = _a.sent();
                if (!existing) return [3 /*break*/, 3];
                return [2 /*return*/, res.status(409).send({ message: 'Email is already taken.' })];
            case 3: return [4 /*yield*/, position.save(position)];
            case 4:
                _a.sent();
                res.send(position);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error(error_1);
                res.status(500).send({
                    message: error_1
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.findAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title, condition, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = req.query.title;
                condition = title ? { title: { $regex: new RegExp(title), $options: 'i' } } : {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Area.find(condition)];
            case 2:
                data = _a.sent();
                res.send(data);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500).send({
                    message: error_2
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.findOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, position, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Area.findOne({ id: id })];
            case 2:
                position = _a.sent();
                res.send(position);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).send({
                    message: error_3
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                if (!req.body) {
                    return [2 /*return*/, res.status(400).send({
                            message: 'Data to update can not be empty!'
                        })];
                }
                id = req.params.id;
                console.log('id', id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Area.updateOne({ id: id }, req.body, {
                        useFindAndModify: true
                    })];
            case 2:
                _a.sent();
                res.send("Area ".concat(id, " updated successful!"));
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.log('error', error_4);
                res.status(500).send({
                    message: error_4
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Area.findOneAndDelete({ id: id })];
            case 2:
                _a.sent();
                res.send("Area ".concat(id, " deleted successful!"));
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.log('error', error_5);
                res.status(500).send({
                    message: error_5
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Area.deleteMany({})];
            case 1:
                _a.sent();
                res.send("Database deleted successful!");
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.log('error', error_6);
                res.status(500).send({
                    message: error_6
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
