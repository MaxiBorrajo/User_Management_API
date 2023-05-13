//imports
const MONGOOSE = require("mongoose");
const DATABASE_URI = process.env.DB_URI;

//config
MONGOOSE.set("strictQuery", true);

//methods
/**
 * Establish connection with database with uri as enviroment variable DATABASE_URI
 * @throws {Error} - If cannot connects with database throws an error.
 */
async function database_connection() {
  //Waits until mongoose connects with database 
  await MONGOOSE
    .connect(DATABASE_URI)
    .then((res) => {
      //If connects, prints in console that connection was established
      console.log("Succesfully connected to database");
    })
    .catch((err) => {
      //If doesn't connect, throws an error
      throw new Error(`Connection to database failed, ERROR: ${err.message}`);
    });
}

//exports
module.exports = {
  database_connection
};
