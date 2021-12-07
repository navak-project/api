
export {};
const express = require("express");
const cors = require("cors");
const app = express();
import { Schema, model, connect } from 'mongoose';
var corsOptions = {
  origin: "http://localhost:8081"
};

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

require("./app/routes/user.routes")(app);
require("./app/routes/pulsesensor.routes")(app);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
});

