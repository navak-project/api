import dbConfig = require("../config/db.config");
import mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {} as any;

db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./user.model")(mongoose);
db.stations = require("./station.model")(mongoose);
db.mqtt = require("./mqtt.model")();

export { db };