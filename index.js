//imports
const SERVER = require("./server");
const USER = require("./src/resources/user/user");
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

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function createRandomUsers() {
  try {
    for (let i = 1; i <= 100; i++) {
      const randomNumber = getRandomNumber(1, 100);
      const randomBoolean = Math.random() > 0.5;

      const user = new USER({
        email: `usuario${i}@example.com`,
        role: Math.random() > 0.5 ? "USER" : "ADMIN",
        password: `contraseña${randomNumber}`,
        name: `Usuario ${randomNumber}`,   
        last_name: "Ejemplo",
        profile_photo: `url_foto${randomNumber}`, 
        phone_number: `${randomNumber}${randomNumber}${randomNumber}${randomNumber}${randomNumber}${randomNumber}${randomNumber}${randomNumber}`,
        country: `País ${randomNumber}`,
        address: {
          street: `Calle ${randomNumber}`,
          city: `Ciudad ${randomNumber}`,
          state: `Estado ${randomNumber}`,
          zip_code: `${randomNumber}${randomNumber}${randomNumber}${randomNumber}${randomNumber}`,
        },
        age: getRandomNumber(18, 65),
        gender: Math.random() > 0.5 ? "Male" : "Female",
        is_verified: randomBoolean,
        is_active: randomBoolean,
        is_public: randomBoolean,
        studies: [`Estudio ${randomNumber}`, `Estudio ${randomNumber + 1}`],
        professions: [`Profesión ${randomNumber}`],
        interests: [`Interés ${randomNumber}`, `Interés ${randomNumber + 1}`],
      });

      await user.save();
      console.log(`Usuario creado`);
    }
    console.log("Todos los usuarios se han creado correctamente.");
  } catch (error) {
    console.error("Error al crear usuarios:", error); 
  }
}

start_server();

// Llama a la función para crear usuarios con valores aleatorios
//createRandomUsers();

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
