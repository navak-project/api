module.exports = (app : any) => {
  const positions = require("../controllers/position.controller");

  var router = require("express").Router();

  // Reset all pulse to 0
  router.post("/reset/", positions.resetAll);

  // Reset one pulse to 0
  router.put("/reset/:id", positions.reset);

  // Create a new User
  router.post("/", positions.create);

  // Retrieve all positions
  router.get("/", positions.findAll);

  // Retrieve a single User with id
  router.get("/:id", positions.findOne);

  // Update a User with id
  router.put("/:id", positions.update);

  // Delete a User with id
  router.delete("/:id", positions.delete);

  // Create a new User
  router.delete("/", positions.deleteAll);

  app.use('/api/positions', router);
};