import dbConfig = require("../config/db.config");
import mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {} as any;

db.mongoose = mongoose;
db.url = dbConfig.url;
//db.mqtt = require("./mqtt.model")(mongoose);
db.lanterns = require("./lantern.model")(mongoose);
db.stations = require("./station.model")(mongoose);
db.positions = require("./position.model")(mongoose);

export { db };