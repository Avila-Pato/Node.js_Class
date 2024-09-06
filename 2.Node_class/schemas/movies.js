// para validar los datos de entrada usamos zod
const z = require('zod')

const movieSchema = z.object({
    title: z.string(),
    year: z.number().int().positive().min(1900).max(2024),
    director: z.string(),
    duration: z.number().positive().int(),
    rate: z.number().min(0).max(10).default(5.5),
    poster: z.string().url({message: 'Poster debe ser un url valido'})
      .endsWith('.jpg'),
    genre: z.array(
      z.enum(['Action', 'Adventure', 'Comedy',  'Drama', 'Sci-Fi', 'Crime','Short']),
      {
        message: 'Genero debe ser uno de los siguientes: Action, Adventure, Comedy'
      }
    )
})

function validateMovie (input) {
    // safe parse devuelve si ahi un error o si ahi datos
  return movieSchema.safeParse(input)
}
function validatePartialMovie (input) {
  // partial nos permite que no se requieran todos los campos osea que sean opcionales
return movieSchema.partial().safeParse(input)
}
module.exports = {
  validateMovie,
  validatePartialMovie
}