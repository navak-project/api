
export {};
import { db } from '../models';
const User = db.users
const client = db.mqtt;
const randomColor = require('../utils');

// RESET PULSE TO 0
exports.resetAll = async (req : any, res : any) => {
  try {
    const options = { upsert: true };
    const allUser = await User.find();
    allUser.forEach(async (element : any) => {
      //const thisUser = await User.findOne({id:id});
      await User.updateOne({id:element.id}, {"pulse":"0", "rgb": "0, 0, 0, 0" }, options)
      const thisUser = await User.findOne({id:element.id})
      client.publish(`/lantern/${thisUser.id}/reset`, JSON.stringify(thisUser))
      console.log(thisUser);
    });
    res.send("All pulse are now set to 0");
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error
    });
  }
}

// RESET ONE PULSE TO 0
exports.reset = async (req : any, res : any) => {
  const id = req.params.id;
  try {
    await User.updateOne({id:id}, {"pulse": "0", "rgb":"0, 0, 0, 0"}, { useFindAndModify: false })
    const user = await User.findOne({id:id});
    console.log(user);
    client.publish(`/lanterns/${user.id}/reset`, JSON.stringify(user))
    res.send(`User ${id} pulse is now 0!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
}

//SEND A RANDOMUSER WITH PULSE 0 WITH A RECEIVED PULSE VALUE 
exports.randomUser = async (req : any, res : any) => {
  const color = await randomColor.getRandomColor();
  //global.color = color;
  try {
    const filter = { pulse: 0 };
    const allAvailableUser = await User.find(filter);
    if (allAvailableUser.length <= 0) {
      return res.status(400).send({
         message: 'No lantern available!'
      });
    }
    let picked = allAvailableUser[Math.floor(Math.random() * allAvailableUser.length)]
    const options = { upsert: true };
    const updateDoc = {
      $set: { rgb: color },
     };
    await User.updateOne({_id: picked._id}, updateDoc, options);
    //console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);
    const user = await User.findById(picked._id);
    res.send(user);
  } catch (error) {
    res.status(500).send({
      message: error
    });
  }
}

// Create and Save a new user
exports.create = async (req : any, res : any) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const user = new User({
      hostName: req.body.hostName,
      macAddress: req.body.macAddress,
      ipAddress: req.body.ipAddress,
    });
    await user.save(user);
    console.log('user', user);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error
    });
  }
};

// Retrieve all Users from the database.
exports.findAll = async (req : any, res : any) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  try {
    const data = await User.find(condition);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error
    });
  }
};

// Find a single User with an id
exports.findOne = async (req : any, res : any) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({id:id});
    res.send(user);
  } catch (error) {
    res.status(500).send({
      message: error
    });
  }
};

// Update a User by the id in the request
exports.update = async (req : any, res : any) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  try {
    await User.updateOne({id:id}, req.body, { useFindAndModify: false })
    const user = await User.findOne({id:id});
    client.publish(`/lantern/${user.id}/audio/ignite`, user.pulse.toString())
    client.publish(`/lanterns/isactive`, JSON.stringify(user))
    //client.publish(`api/users/${user.id}/active`, JSON.stringify(user))
    res.send(`User ${id} updated successful!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
};

// Delete a User with the specified id in the request
exports.delete = async (req : any, res : any) => {
  const id = req.params.id;
  try {
    await User.findByIdAndRemove(id)
      res.send(`User ${id} deleted successful!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
};

// Delete all Users from the database.
exports.deleteAll = async (req : any, res : any) => {
  try {
    await User.deleteMany({})
      res.send(`Database deleted successful!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
};