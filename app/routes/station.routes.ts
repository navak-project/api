module.exports = (app : any) => {
  const stations = require("../controllers/station.controller");

  var router = require("express").Router();

  // Reset all pulse to 0
  router.post("/reset/", stations.resetAll);

  router.post("/reboot/:id", stations.reboot);

  // Reset one pulse to 0
  router.put("/reset/:id", stations.reset);

  router.put("/presence/:id", stations.presence);

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