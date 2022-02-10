module.exports = (app : any) => {
  const positions = require("../controllers/position.controller");

  var router = require("express").Router();
  
  // Create a new User
  router.post("/", positions.create);

  // Retrieve all positions
  router.get("/", positions.findAll);

  // Return position of the tag
  router.get("/snap", positions.getPosition);

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