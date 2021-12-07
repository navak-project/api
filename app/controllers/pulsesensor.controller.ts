import { db } from '../models';
const Pulsesensor = db.pulseSensors;
const client = db.mqtt;

exports.resetAll = async (req : any, res : any) => {
  try {
    const options = {
      upsert: true
    };
    const allStation = await Pulsesensor.find();
    allStation.forEach(async (element:any) => {
      await Pulsesensor.updateOne({
        _id: element._id
      }, { "state": 0 }, options);
    });
    res.send("All Pulse Sensors are now set to 0");
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error
    });
  }
}

exports.reset = async (req : any, res : any) => {
  const id = req.params.id;
  try {
    await Pulsesensor.findByIdAndUpdate(id, {
      "state": 0
    }, { useFindAndModify: false })
    res.send(`Pulse Sensor ${id} stae is now 0!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
}

exports.create = async (req : any, res : any) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  try {
    const pulsesensor = new Pulsesensor({
      id: req.body.id,
      universe: req.body.universe,
      state: req.body.state,
    });
    await pulsesensor.save(pulsesensor);
    res.send(pulsesensor);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error
    });
  }
};

exports.findAll = async (req : any, res : any) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  try {
    const data = await Pulsesensor.find(condition);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error
    });
  }
};

exports.findOne = async (req : any, res : any) => {
  const id = req.params.id;
  try {
    const pulsesensor = await Pulsesensor.findOne({ id: id });
    res.send(pulsesensor);
  } catch (error) {
    res.status(500).send({
      message: error
    });
  }
};

exports.update = async (req : any, res : any) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  try {
    await Pulsesensor.updateOne({id:id}, req.body, {
      useFindAndModify: true
    })
    const puslesensor = await Pulsesensor.findOne({id:id});
    client.publish(`/bpmstation/${id}/state`, JSON.stringify(puslesensor))
    res.send(`PulseSensor ${id} updated successful!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
};

exports.delete = async (req : any, res : any) => {
  const id = req.params.id;
  try {
    await Pulsesensor.findByIdAndRemove(id)
    res.send(`Pulsesensor ${id} deleted successful!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
};

exports.deleteAll = async (req : any, res : any) => {
  try {
    await Pulsesensor.deleteMany({})
    res.send(`Database deleted successful!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
};