import { db } from '../models';
import {fixtures} from '../utils/mqtt';
const Fixture = db.fixtures;
const Areas = db.areas;

exports.create = async (req: any, res: any) => {
	if (!req.body) {
		res.status(400).send({
			message: 'Content can not be empty!'
		});
		return;
	}
	try {
		const fixture = new Fixture({
      id: req.body.id,
      name: req.body.name,
      universe: req.body.universe,
      address: req.body.address,
      area: req.body.area,
      fixtureType: req.body.fixtureType
    });
    const area = await Areas.find({name: req.body.area});
		const existing = await Fixture.find({id: req.body.id});
		if (existing.length !== 0 ) {
			return res.status(409).send({message: 'Fixture is already taken. Please try another ID.'});
    }
    if (area.length === 0) {
			return res.status(409).send({message: 'The area don\'t exist.'});
    }
    await fixture.save(fixture);
    fixtures.publish('/fixture', `${req.body.id}`);
    res.send(fixture);
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
		const data = await Fixture.find(condition);
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
		const position = await Fixture.findOne({id: id});
		res.send(position);
	} catch (error) {
		res.status(500).send({
			message: error
		});
	}
};

exports.update = async (req: any, res: any) => {
	if (!req.body) {
		return res.status(400).send({
			message: 'Data to update can not be empty!'
		});
	}
	const id = req.params.id;
	console.log('id', id);
	try {
		await Fixture.updateOne({id: id}, req.body, {
			useFindAndModify: true
    });
    fixtures.publish('/fixture', `area changed - ${req.body.id}`);
    res.send(`Fixture ${id} updated successful!`);
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
    await Fixture.findOneAndDelete({ id: id });
		res.send(`Fixture ${id} deleted successful!`);
	} catch (error) {
		console.log('error', error);
		res.status(500).send({
			message: error
		});
	}
};

exports.deleteAll = async (req: any, res: any) => {
	try {
		await Fixture.deleteMany({});
		res.send(`Database deleted successful!`);
	} catch (error) {
		console.log('error', error);
		res.status(500).send({
			message: error
		});
	}
};
