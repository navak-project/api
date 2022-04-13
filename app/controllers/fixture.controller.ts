import {db} from '../models';
const Fixture = db.fixtures;

exports.create = async (req: any, res: any) => {
	if (!req.body) {
		res.status(400).send({
			message: 'Content can not be empty!'
		});
		return;
	}
	try {
		const position = new Fixture({
			id: req.body.id,
      name: req.body.name,
      universe: req.body.universe,
			address: req.body.address,
			area: req.body.area,
      fixtureType: req.body.fixtureType,
		});
		const existing = await Fixture.findOne({id: req.body.id});
		if (existing) {
			return res.status(409).send({message: 'Fixture is already taken.'});
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
