const mongoose = require("mongoose");
const Initdata = require("./data.js");
const Listing = require("../models/listing.js");
main()
  .then(async () => {
    console.log("connected successfull to db ");
    await initDB();
    await mongoose.connection.close();
    console.log("db initialized");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  Initdata.data = Initdata.data.map((obj) => ({ ...obj, owner: "69cce8016efbc4710b95377d" }));
  await Listing.insertMany(Initdata.data);
};
