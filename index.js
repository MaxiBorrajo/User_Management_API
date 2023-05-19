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

/**
 * Función que suma dos números.
 * @param {number} a - El primer número a sumar.
 * @param {number} b - El segundo número a sumar.
 * @returns {number} La suma de los dos números.
 * @throws {Error} Si alguno de los parámetros no es un número.
 */

/**
 * Middleware de autenticación.
 * 
 * Este middleware se utiliza para autenticar a los usuarios que acceden a una ruta protegida.
 * Comprueba si el usuario ha iniciado sesión y si tiene las credenciales adecuadas.
 * 
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La siguiente función en la cadena de middleware.
 * @throws {Error} Si el usuario no está autenticado o no tiene los permisos adecuados.
 */

/**
 * Descripción breve de la ruta.
 *
 * @route {MÉTODO} /ruta
 * @description Descripción detallada de la ruta y su funcionalidad.
 * @access {TIPO DE ACCESO} - Nivel de acceso requerido para acceder a la ruta.
 *
 * @param {tipo} nombre - Descripción del parámetro.
 * @query {tipo} nombre - Descripción del parámetro de consulta (opcional).
 * @body {tipo} nombre - Descripción del cuerpo de la solicitud (si es aplicable).
 *
 * @throws {CustomError} - Descripción de los posibles errores lanzados por la ruta.
 */