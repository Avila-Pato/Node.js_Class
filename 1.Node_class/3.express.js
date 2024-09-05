// Usando express para respuestas http
const express = require('express')
const app = express()
const ditto = require('./pokemon/ditto.json')
const PORT = process.env.PORT ?? 1234

// configurar el middleware para que pueda leer el body de las solicitudes
app.use((req, res, next) => {
  // si la request es diferente al post va a la siguiente funcion
  if (req.method !== 'POST') return next()
  // si los headers no son de tipo json va a la siguiente
  if (req.headers['content-type'] !== 'application/json') { return next() }

  // solo llegan requests con el tipo de contenido correcto POST
  // Y que el content type sea json en este caso
  let body = ''
  // escuchar el evento data
  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(body)
    data.timestamp = Date.now()
    // mutaamos la request y se mete la informacion en el req.body
    // porque la resquest es 1 para cada peticion
    req.body = data
    next()
  })
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto)
  // respuesta
  // Express muchas veces detecta cual es el context type de respuesta
  // y lo envia automaticamente y no es necesario especificarlo como lo hacemos con el http
  res.send('<h1>Hello World From EXpress!</h1>')
  // tipo de respuesta en Json
//   res.json({
//     username: 'juan',
//     lastname: 'perez'
//   })
})
app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})
// llamando al servidor 404 not found si no enccuentra la ruta
app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>')
})
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
// Los middlleware son funciones que se ejecutan
// antes de que se maneje una solicitud entran cokies
// validan si el usuario esta autenticado, extrae informacion del json
// cual quiero tipo de respuesta que quiero enviar
// par aluego usar le metodo next() para que continue con
// el siguiente middleware o la ruta
