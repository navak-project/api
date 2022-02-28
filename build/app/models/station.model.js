"use strict";
module.exports = function (mongoose) {
    var Station = mongoose.model("station", mongoose.Schema({
        id: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: true
        },
        universe: {
            type: String,
            required: false
        },
        state: {
            type: Number,
            required: false,
            default: 0,
        },
        rgb: {
            type: String,
            required: false,
            default: '0,0,0,255'
        },
    }));
    return Station;
};
