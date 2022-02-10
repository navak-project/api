import { db } from '../models';
const Position = db.positions;
const client = db.mqtt;

exports.getPosition = async (req: any, res: any) => {
  
  try {
    client.subscribe('dwm/node/d491/uplink/location');
    client.on('message', function (topic: String, message: String) {
      //client.end();
      client.unsubscribe('dwm/node/d491/uplink/location');
      const allo = message.toString();
      console.log(allo);
      res.send(message.toString());

   })
  } catch (error) {
    res.status(500).send({
      message: error
    });
  } 

};

exports.create = async (req : any, res : any) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  try {
    const station = new Position({
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
    const data = await Position.find(condition);
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
    const station = await Position.findOne({ id: id });
    res.send(station);
  } catch (error) {
    res.status(500).send({
      message: error
    });
  }
};

exports.update = async (req: any, res: any) => {
  console.log(req.body)
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  console.log('id', id);
  try {
    await Position.updateOne({id:id}, req.body, {
      useFindAndModify: true
    })
    res.send(`Position ${id} updated successful!`);
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
    await Position.findByIdAndRemove(id)
    res.send(`Position ${id} deleted successful!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
};

exports.deleteAll = async (req : any, res : any) => {
  try {
    await Position.deleteMany({})
    res.send(`Database deleted successful!`);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error
    });
  }
};