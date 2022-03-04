"use strict";
module.exports = function (app) {
    var stations = require("../controllers/station.controller");
    var router = require("express").Router();
    // Reset all pulse to 0
    router.post("/reset/", stations.resetAll);
    // Reset one pulse to 0
    router.put("/reset/:id", stations.reset);
    // Create a new User
    router.post("/", stations.create);
    // Retrieve all stations
    router.get("/", stations.findAll);
    // Retrieve a single User with id
    router.get("/:id", stations.findOne);
    // Update a User with id
    router.put("/:id", stations.update);
    // Delete a User with id
    router.delete("/:id", stations.delete);
    // Create a new User
    router.delete("/", stations.deleteAll);
    app.use('/api/stations', router);
};