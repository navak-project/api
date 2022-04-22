module.exports = (app : any) => {
  const areas = require("../controllers/area.controller");

  var router = require("express").Router();
  
  // Create a new User
  router.post("/", areas.create);

  // Retrieve all areas
  router.get("/", areas.findAll);

  // Return position of the tag
  router.get("/snap/:id", areas.getToolPosition);

  // Retrieve a single User with id
  router.get("/:id", areas.findOne);

  // Update a User with id
  router.put("/:id", areas.update);

  // Delete a User with id
  router.delete("/:id", areas.delete);

  // Create a new User
  
  router.delete("/", areas.deleteAll);

  app.use('/api/areas', router);
};