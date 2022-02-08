import dbConfig = require("../config/db.config");
import mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {} as any;

db.mongoose = mongoose;
db.url = dbConfig.url;
db.lanterns = require("./lantern.model")(mongoose);
db.stations = require("./station.model")(mongoose);

export { db };