module.exports = (app : any) => {
  const fixtures = require("../controllers/fixture.controller");

  var router = require("express").Router();
  
  // Create a new User
  router.post("/", fixtures.create);

  // Retrieve all fixtures
  router.get("/", fixtures.findAll);

  // Retrieve a single User with id
  router.get("/:id", fixtures.findOne);

  // Update a User with id
  router.put("/:id", fixtures.update);

  // Delete a User with id
  router.delete("/:id", fixtures.delete);

  // Create a new User
  router.delete("/", fixtures.deleteAll);

  app.use('/api/fixtures', router);
};