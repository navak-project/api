import { db } from '../models';
const Station = db.stations;
const client = db.mqtt;

exports.resetAll = async (req : any, res : any) => {
  try {
    const options = {
      upsert: true
    };
    const allStation = await Station.find();
    allStation.forEach(async (element:any) => {
      await Station.updateOne({
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
    await Station.findByIdAndUpdate(id, {
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
    const station = new Station({
      id: req.body.id,
      universe: req.body.universe,
      state: req.body.state,
    });
    await station.save(station);
    res.send(station);
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
    const data = await Station.find(condition);
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
    const station = await Station.findOne({ id: id });
    res.send(station);
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
    await Station.updateOne({id:id}, req.body, {
      useFindAndModify: true
    })
    const puslesensor = await Station.findOne({id:id});
    client.publish(`/bpmstation/${id}/state`, JSON.stringify(puslesensor))
    res.send(`Station ${id} updated successful!`);
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
    await Station.findByIdAndRemove(id)
    res.send(`Station ${id} deleted successful!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
};

exports.deleteAll = async (req : any, res : any) => {
  try {
    await Station.deleteMany({})
    res.send(`Database deleted successful!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
};