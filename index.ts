require('dotenv').config()
import express from 'express';
const app = express();
import cors from 'cors';
import {connect} from 'mongoose';
import { pingLanterns , pingStations } from './app/utils';
import { version  } from './package.json';
var cron = require('node-cron');
import { connectMqtt  } from './app/utils/mqtt'

var corsOptions = {
	origin: 'http://localhost:8081'
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
		console.log(`💾 Connected to the database: ${db.url}`);
	} catch (err) {
		console.log(err);
		process.exit();
	}
}

mqttInit().catch((err) => console.log(err));
async function mqttInit(): Promise<void> {
  try {
   connectMqtt();
	} catch (err) {
		console.log(err);
		process.exit();
	}
}


const PORT = process.env.PORT || 8080;

require('./app/routes/lantern.routes')(app);
require('./app/routes/station.routes')(app);
require('./app/routes/area.routes')(app);

// default path
app.get('/', (req, res) => {
  res.send(`Navak API - ${version}`);
});

app.listen(PORT, async () => {
  console.log(`💻 Server is running: ${require('ip').address()}:${process.env.PORT}`);
	cron.schedule('*/5 * * * * *', async function () {
    await pingLanterns();
    await pingStations();
  });
});
