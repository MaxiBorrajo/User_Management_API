//imports
const SERVER = require("./server");
const {
  database_connection,
} = require("./src/global_config/database_connection");

//methods

/**
 * Starts server in port establish in enviroment variable PORT,
 * and establish a connection with the database before starts listening.
 * @throws {Error} - If cannot connects with database throws an error.
 */
function start_server() {
  // Starts server
  SERVER.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}.`);

    // Establish connection with database
    database_connection();
  });
}

start_server();