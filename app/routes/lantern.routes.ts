module.exports = (app : any) => {
  const lanterns = require("../controllers/lantern.controller");

  var router = require("express").Router();

  // Reset all pulse to 0
  router.post("/reset/", lanterns.resetAll);

  // Reset one pulse to 0
  router.put("/reset/:id", lanterns.reset);

  // Return random user with pulse sended
  router.get("/randomUser/:id", lanterns.randomUser);

  // Create a new User

  router.post("/register", lanterns.create);

  // Retrieve all active
  router.get("/active", lanterns.findActive);

  // Retrieve all lanterns
  router.get("/", lanterns.findAll);

  // Retrieve a single User with id
  router.get("/:id", lanterns.findOne);

  // Update a User with id
  router.put("/:id", lanterns.update);

  // Delete a User with id
  router.delete("/:id", lanterns.delete);

  // Create a new User
  router.delete("/", lanterns.deleteAll);

  app.use('/api/lanterns', router);
};