"use strict";
module.exports = function (app) {
    var lanterns = require("../controllers/lantern.controller");
    var router = require("express").Router();
    // Reset all pulse to 0
    router.post("/reset/", lanterns.resetAll);
    // Reset one pulse to 0
    router.put("/reset/:id", lanterns.reset);
    // Return random user with pulse sended
    router.get("/randomUser/:id", lanterns.randomUser);
    // Return lanterns live position
    router.get("/positions/:id", lanterns.getLivePosition);
    // Create a new User
    router.post("/register", lanterns.create);
    // Retrieve all active
    router.get("/active", lanterns.findActive);
    //Reboot lanterns
    router.post("/reboot", lanterns.reboot);
    //Flash lanterns
    router.post("/flash", lanterns.flash);
    // Retrieve all lanterns
    router.get("/", lanterns.findAll);
    // Retrieve a single User with id
    router.get("/:id", lanterns.findOne);
    // Update a User with id
    router.put("/:id", lanterns.update);
    //Update status
    router.post("/updateStatus", lanterns.updateStatus);
    // Delete a User with id
    router.delete("/:id", lanterns.delete);
    // Create a new User
    router.delete("/", lanterns.deleteAll);
    app.use('/api/lanterns', router);
};
