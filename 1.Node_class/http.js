const http = require('node:http') // Protocolo HTTP

//   traemos  el modulo fs para leer el archivo de imagen
const fs = require('fs')

/// Puerto
const desiredPort = process.env.PORT ?? 1234

// Funcion que procesa las peticiones
const processRequest = (req, res) => {
  if (req.url === '/') {
    // tipo de respuesta es html
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8 ' })
    res.write('<h1>Hola esto es un saludo del back </h1>')
    res.end()
  } else if (req.url === '/img/200.jpg') {
    // Leemos la imagen de manera asíncrona
    fs.readFile('./img/200.jpg', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' })
        res.end('<h1>500 Internal Server Error</h1>')
      } else {
        res.writeHead(200, { 'Content-Type': 'image/jpg' })
        res.end(data)// Aquí enviamos la imagen
      }
    })
  } else if (req.url === '/hola') {
    // tipo de respuesta es texto plano puede solo ser un tipo de respuesta pero en este aso doy 2 ejemplos
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8 ' })
    res.write('Hola esto es un segundo saludo del back')
    res.end()
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.write('<h1>404 Not Found</h1>')
    res.end()
  }
}

// Creamos el servidor que recibe  las peticiones
const server = http.createServer(processRequest)

// Escuchamos el servidor en el puerto
server.listen(desiredPort, () => {
  console.log(`server listening on port http://localhost:${desiredPort}`)
})

// tipos de respuestas http (STATUS CODE)

// los mas comunes son:
// 200=OK
// 404=Not Found
// 500=Internal Server Error (error del servidor)
// 301 = Moved Permanently

// 100=199 respuestas informativas
// 200=299 respuestas correctas
// 300=399 respuestas redireccion
// 400=499 respuestas errores del cliente
// 500=599 respuestas errores del servido;
