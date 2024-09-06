const express = require('express');
const cors = require('cors');
const crypto = require('node:crypto');
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js');
const movies = require('./movies.json');

const app = express();
app.use(express.json());
app.disable('x-powered-by'); // Desactivando la cabecera "X-Powered-By" de Express

// Lista de orígenes aceptados para CORS en este caso
const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://127.0.0.1:5500', // Agrega el origen necesario aquí
  'https://movies.com',
  'https://pato.dev'
];

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
      callback(null, true); // Permite la solicitud si el origen está en la lista
    } else {
      callback(new Error('Not allowed by CORS')); // Bloquea la solicitud si el origen no está permitido
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type'], // Encabezados permitidos en las solicitudes
};

// Aplica el middleware CORS a todas las rutas
app.use(cors(corsOptions));

// Recuperar todas las películas
app.get('/movies', (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(
        g => g.toLowerCase() === genre.toLowerCase()
      )
    );
    if (filteredMovies.length > 0) {
      return res.json(filteredMovies);
    }
    return res.status(404).json({ message: 'Movie not found' });
  }
  res.json(movies);
});

// Recuperar una película por ID
app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find(movie => movie.id === id);
  if (movie) {
    return res.json(movie);
  }
  res.status(404).json({ message: 'Movie not found' });
});

// Agregar una nueva película
app.post('/movies', (req, res) => {
  const result = validatePartialMovie(req.body);

  if (result.error) {
    // 400 Bad Request el cliente envía datos incorrectos
    return res.status(400).json({ message: result.error.message });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data // Agrega los datos de entrada y los guarda en la variable newMovie
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// Actualizar una película por ID
app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body);
  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (!result.success) {
    return res.status(400).json({ error: result.error.message });
  }
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  // Actualiza la película
  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  };
  // Guarda la película actualizada en el índice
  movies[movieIndex] = updatedMovie;
  // Responde con la película actualizada
  return res.json(updatedMovie);
});

// Eliminar una película por ID
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  movies.splice(movieIndex, 1);
  return res.json({ message: 'Movie deleted' });
});

// Permitir solicitudes OPTIONS para manejar preflight requests
app.options('*', cors(corsOptions));

// Puerto de escucha
const PORT = process.env.PORT ?? 1234;
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
