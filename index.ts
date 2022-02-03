import express from "express";
const app = express();
import ping from 'ping';
import cors from 'cors';
import {pulseOSC} from './app/utils';
import {connect} from 'mongoose';

var corsOptions = {
  origin: "http://localhost:8081"
};

var pingcfg = { 
  timeout: 2,
  extra: ['-i', '2']
}

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
		
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models").db;

run().catch(err => console.log(err));

async function run(): Promise<void> {
  
  try {
    await connect(db.url);
    console.log("Connected to the database!");
  } catch (err) {
    console.log(err);
    process.exit();
  }
}

// set port, listen for requests
const PORT = process.env.PORT || 8080;

require("./app/routes/lantern.routes")(app);
require("./app/routes/station.routes")(app);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  setInterval(() => {
    GetAllActive();
  }, 5000);
});

async function GetAllActive() {
  var query = {status : true};
  try {
      
      const allActive = await db.lanterns.find(query);
      allActive.forEach((lantern: any) => {
          ping.sys.probe(lantern['ipAddress'], (status : any) => {
            if(!status){
              UpdateState(lantern['ipAddress']);
            }
          }, pingcfg);
        });
    } catch (error) {
        console.error(error);
    }
}

async function UpdateState(ipAddress : any) {
  var query = {ipAddress: ipAddress};
  var newValues = {status: false};
  const target = await db.lanterns.findOneAndUpdate(query, newValues);
  console.log(`Lantern [ID: ${target.id} | IP: ${target.ipAddress} | MAC: ${target.macAddress}] is Offline!`);
  pulseOSC();
}