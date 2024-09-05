const express = require('express')

const app = express();
app.disable('x-powered-by') // desctivando la publicidad de express 

app.get('/', (req, res) => {
  res.json('Hello World!')
})

const  PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})