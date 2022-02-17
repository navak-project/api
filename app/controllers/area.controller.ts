import { db } from '../models';
import { client } from '../utils/mqtt';
const Area = db.areas;

let toolPosition: any;
let allPosition: any;

client.subscribe('dwm/node/+/uplink/location');
client.on('message', function (topic: String, message: String) {
  if (topic === 'dwm/node/d491/uplink/location') { 
    toolPosition = message.toString()
  }
});
  
exports.getToolPosition = async (req: any, res: any) => {
  console.log("🚀 ~ file: position.controller.ts ~ line 14 ~ exports.getPosition= ~ currentPosition", toolPosition);
  res.send(toolPosition);
};

exports.create = async (req: any, res: any) => {
	if (!req.body) {
		res.status(400).send({
			message: 'Content can not be empty!'
		});
		return;
	}
	try {
		const position = new Area({
			id: req.body.id,
			name: req.body.name,
			x: req.body.x,
			y: req.body.y,
			z: req.body.z,
			size: req.body.size
		});
		const existing = await Area.findOne({id: req.body.id});
		if (existing) {
			return res.status(409).send({message: 'Email is already taken.'});
		} else {
			await position.save(position);
			res.send(position);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({
			message: error
		});
	}
};

exports.findAll = async (req: any, res: any) => {
	const title = req.query.title;
	var condition = title ? {title: {$regex: new RegExp(title), $options: 'i'}} : {};
	try {
		const data = await Area.find(condition);
		res.send(data);
	} catch (error) {
		res.status(500).send({
			message: error
		});
	}
};

exports.findOne = async (req: any, res: any) => {
	const id = req.params.id;
	try {
		const position = await Area.findOne({id: id});
		res.send(position);
	} catch (error) {
		res.status(500).send({
			message: error
		});
	}
};

exports.update = async (req: any, res: any) => {
	console.log(req.body);
	if (!req.body) {
		return res.status(400).send({
			message: 'Data to update can not be empty!'
		});
	}
	const id = req.params.id;
	console.log('id', id);
	try {
		await Area.updateOne({id: id}, req.body, {
			useFindAndModify: true
		});
		res.send(`Area ${id} updated successful!`);
	} catch (error) {
		console.log('error', error);
		res.status(500).send({
			message: error
		});
	}
};

exports.delete = async (req: any, res: any) => {
	const id = req.params.id;
	try {
		await Area.findOneAndDelete({id: id});
		res.send(`Area ${id} deleted successful!`);
	} catch (error) {
		console.log('error', error);
		res.status(500).send({
			message: error
		});
	}
};

exports.deleteAll = async (req: any, res: any) => {
	try {
		await Area.deleteMany({});
		res.send(`Database deleted successful!`);
	} catch (error) {
		console.log('error', error);
		res.status(500).send({
			message: error
		});
	}
};
