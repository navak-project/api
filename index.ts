require('dotenv').config()
import express from 'express';
const app = express();
import cors from 'cors';
import {connect} from 'mongoose';
import {pingLanterns , register} from './app/utils';
var cron = require('node-cron');

var corsOptions = {
	origin: 'http://localhost:8081'
};

var pingcfg = {
	timeout: 2,
	extra: ['-i', '2']
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

const db = require('./app/models').db;

run().catch((err) => console.log(err));

async function run(): Promise<void> {
	try {
		await connect(db.url);
		console.log('Connected to the database!');
	} catch (err) {
		console.log(err);
		process.exit();
	}
}

const PORT = process.env.PORT || 8080;

require('./app/routes/lantern.routes')(app);
require('./app/routes/station.routes')(app);

// default path
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
	cron.schedule('*/5 * * * * *', async function () {
	await pingLanterns();
  });
});
