"use strict";
require("dotenv/config");
console.log("🚀 ~ file: db.config.ts ~ line 4 ~ process.env.MONGODB", process.env.MONGODB);
module.exports = {
    url: "mongodb://".concat(process.env.MONGODB, ":27017/navak")
};
