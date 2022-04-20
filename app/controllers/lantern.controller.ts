import {db} from '../models';
import {getRandomColor} from '../utils';
const Lantern = db.lanterns;
const Station = db.stations;
import {lanterns} from '../utils/mqtt';

let livePosition: any;
let liveTopic: any;
let id: any;

lanterns.on('message', function (topic: String, message: String) {
	livePosition = message.toString();
	liveTopic = topic;
});

lanterns.unsubscribe(`dwm/node/+/uplink/location`);
async function getData() {
	lanterns.subscribe(`dwm/node/${id}/uplink/location`);
	if (liveTopic === `dwm/node/${id}/uplink/location`) {
		setTimeout(() => {
			lanterns.unsubscribe(`dwm/node/${id}/uplink/location`);
		}, 100);
		return {position: livePosition, topic: liveTopic, id: id};
	}
}

exports.getLivePosition = async (req: any, res: any) => {
	lanterns.unsubscribe(`dwm/node/+/uplink/location`);
	id = req.params.id;
	let data: any = await getData();
	res.send(data);
};

exports.reboot = async (req: any, res: any) => {
	try {
		lanterns.publish(`/lanterns/${req.body.id}/reboot`, '{"reboot":{"state":1}}');
	} catch (err) {}
	res.send(`Rebooted ${req.body.id}`);
	setTimeout(() => {
		lanterns.publish(`/lanterns/${req.body.id}/reboot`, '{"reboot":{"state":0}}');
	}, 1000);
};

exports.flash = async (req: any, res: any) => {
	console.log('flash', req.body);
	try {
		lanterns.publish(`/lanterns/${req.body.id}/flash`, '{"flash":{"state":1}}');
	} catch (err) {}
	res.send(`Flashed ${req.body.id} !`);
	setTimeout(() => {
		lanterns.publish(`/lanterns/${req.body.id}/flash`, '{"flash":{"state":0}}');
	}, 3000);
};

exports.resetAll = async (req: any, res: any) => {
	try {
		const options = {upsert: false};
		const allUser = await Lantern.find();
		allUser.forEach(async (element: any) => {
			await Lantern.updateOne({id: element.id}, {pulse: '0', rgb: '0,0,0,1', picked: false}, options);
			const thisUser = await Lantern.findOne({id: element.id});
			lanterns.publish(`/lanterns/${thisUser.id}/reset`, JSON.stringify(thisUser));
			console.log(thisUser);
		});
		res.send('All pulse are now set to 0');
	} catch (error) {
		console.error(error);
		res.status(500).send({
			message: error
		});
	}
};

exports.reset = async (req: any, res: any) => {
	const id = req.params.id;
	try {
		await Lantern.updateOne({id: id}, {pulse: '0', rgb: '0,0,0,1', picked: false}, {useFindAndModify: false});
    const user = await Lantern.findOne({ id: id });
    /// also reset stations if lanterns resets
		lanterns.publish(`/lanterns/${user.id}/reset`, JSON.stringify(user));
		res.send(`Lantern ${id} pulse is now 0!`);
	} catch (error) {
		console.log('error', error);
		res.status(500).send({
			message: error
		});
	}
};

exports.randomUser = async (req: any, res: any) => {
	const color = await getRandomColor();
	try {
		const filter = {status: true, group: req.params.id, picked: false};
		const allAvailableUser = await Lantern.find(filter);
		if (allAvailableUser.length <= 0) {
			return res.status(400).send('No lantern available!');
		}
		let picked = allAvailableUser[Math.floor(Math.random() * allAvailableUser.length)];
		const options = {upsert: true};
		const updateDoc = {
			$set: {rgb: color, picked: true}
		};
		await Lantern.updateOne({_id: picked._id}, updateDoc, options);
		const user = await Lantern.findById(picked._id);
		res.send(user);
	} catch (error) {
		res.status(500).send({
			message: error
		});
	}
};

exports.create = async (req: any, res: any) => {
	if (!req.body) {
		res.status(400).send({message: 'Content can not be empty!'});
		return;
	}
	try {
		const element = await Lantern.findOne({macAddress: req.body.macAddress});
		if (element != null) {
			console.log(`Lantern [ID: ${element.id} | IP: ${req.body.ipAddress} | MAC: ${req.body.macAddress}] already exists`);
			await Lantern.updateOne({macAddress: req.body.macAddress}, {$set: {ipAddress: element.ipAddress}}, {useFindAndModify: false});
			res.send(element);
		} else {
			const lantern = new Lantern({
				hostName: req.body.hostName,
				macAddress: req.body.macAddress,
				ipAddress: req.body.ipAddress
			});
			await lantern.save(lantern);
			lanterns.publish('/lanterns/update', JSON.stringify(req.body.id));
			console.log(`CREATED Lantern [ID: ${req.body.id} | IP: ${req.body.ipAddress}  | MAC: ${req.body.macAddress}]`);
			res.send(lantern);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({
			message: error
		});
	}
};

exports.findActive = async (req: any, res: any) => {
	var query = {status: true};
	try {
		const allActive = await Lantern.find(query);
		res.send(allActive);
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
		const data = await Lantern.find(condition);
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
		const user = await Lantern.findOne({id: id});
		res.send(user);
	} catch (error) {
		res.status(500).send({
			message: error
		});
	}
};

// Update a User by the id in the request
exports.updateStatus = async (req: any, res: any) => {
	if (!req.body) {
		return res.status(400).send({
			message: 'Data to update can not be empty!'
		});
	}
	try {
		var query = {macAddress: req.body.macAddress};
		var newValues = {status: true};
		const target = await Lantern.findOneAndUpdate(query, newValues);
		console.log(`Lantern [ID: ${target.id} | IP: ${target.ipAddress} | MAC: ${target.macAddress}] is Online!`);
		res.send(`Lantern ${target['ipAddress']} is Online!`);
	} catch (error) {
		console.log('error', error);
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
	try {
		await Lantern.updateOne({id: id}, req.body, {useFindAndModify: false});
		const lantern = await Lantern.findOne({id: id});
		await Station.updateOne({lantern: lantern.id}, {$set: {rgb: lantern.rgb}}, {useFindAndModify: false});

		lanterns.publish(`/lanterns/isactive`, JSON.stringify(lantern));
		lanterns.publish('/lanterns/update', JSON.stringify(req.body.id));
		res.send(`Lantern ${id} updated successful!`);
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
		await Lantern.findByIdAndRemove(id);
		res.send(`Lantern ${id} deleted successful!`);
	} catch (error) {
		console.log('error', error);
		res.status(500).send({
			message: error
		});
	}
};

exports.deleteAll = async (req: any, res: any) => {
	try {
		await Lantern.deleteMany({});
		res.send(`Database deleted successful!`);
	} catch (error) {
		console.log('error', error);
		res.status(500).send({
			message: error
		});
	}
};
