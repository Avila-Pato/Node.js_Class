// Respuesta Http sin usar express

const http = require('node:http') // Importa el módulo HTTP de Node.js
const dittoJSON = require('./pokemon/ditto.json') // Importa el archivo JSON con datos de Ditto

// Función para manejar las solicitudes del servidor
const processRequest = (req, res) => {
  const { method, url } = req // Extrae el método y la URL de la solicitud

  switch (method) {
    case 'GET': // Maneja solicitudes GET
      switch (url) {
        case '/pokemon/ditto': // Ruta para obtener datos de Ditto
          res.setHeader('Content-Type', 'application/json; charset=utf-8') // Establece el tipo de contenido como JSON
          res.writeHead(200) // Código de estado 200 OK
          return res.end(JSON.stringify(dittoJSON)) // Envía el contenido del archivo JSON como respuesta

        default:
          res.setHeader('Content-Type', 'text/html; charset=utf-8') // Establece el tipo de contenido como HTML
          res.writeHead(404) // Código de estado 404 Not Found
          return res.end('<h1>404 Not Found no esta</h1>') // Mensaje de error 404
      }

    case 'POST': // Maneja solicitudes POST
      switch (url) {
        case '/pokemon': { // Ruta para recibir datos de Pokemon
          let body = '' // Variable para almacenar el cuerpo de la solicitud

          req.on('data', chunk => {
            body += chunk.toString() // Convierte el chunk a string y lo añade al body
          })

          // Termina la solicitud y procesa los datos recibidos
          req.on('end', () => {
            try {
              const data = JSON.parse(body) // Intenta parsear el cuerpo como JSON
              data.timestamp = Date.now() // Añade un timestamp a los datos
              res.setHeader('Content-Type', 'application/json charset=utf-8') // Establece el tipo de contenido como JSON
              res.writeHead(201) // Código de estado 201 Created Ok
              return res.end(JSON.stringify(data)) // Envía los datos recibidos con el timestamp añadido
            } catch (error) {
              res.setHeader('Content-Type', 'text/plain charset=utf-8') // Establece el tipo de contenido como texto
              res.writeHead(400) // Código de estado 400 Bad Request
              return res.end('Invalid JSON') // Mensaje de error para JSON inválido
            }
          })

          break // Salir del bloque switch
        }
        // Otros metodos o rutas no implementados pero se mantienens
        // para futuras implementaciones y saber como funciona el codigo
        default:
          res.setHeader('Content-Type', 'text/plain charset=utf-8') // Establece el tipo de contenido como texto
          res.writeHead(404) // Código de estado 404 Not Found
          return res.end('404 Not Found') // Mensaje de error 404
      }
      break

    default:
      res.setHeader('Content-Type', 'text/plain charset=utf-8') // Establece el tipo de contenido como texto
      res.writeHead(405) // Código de estado 405 Method Not Allowed
      return res.end('405 Method Not Allowed') // Mensaje de error para método no permitido
  }
}// Crear el servidor y escuchar en el puerto 1234
const server = http.createServer(processRequest)

server.listen(1234, () => {
  console.log('Server listening on http://localhost:1234') // Mensaje de confirmación en consola
})
