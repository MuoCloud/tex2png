import express from 'express'
import helmet from 'helmet'
import svg2png from './svg2png'
import tex2svg from './tex2svg'

const PORT = 3180
const HTTP_ERROR_BAD_REQUEST = 400
const DEFAULT_WIDTH = 200

const app = express()

app.use(helmet())

app.get('/', async (req, res, next) => {
    const width = Number(req.query.width ?? DEFAULT_WIDTH)
    const math = req.query.math

    if (!math) {
        res.status(HTTP_ERROR_BAD_REQUEST)
        res.json({ error: 'math is missing' })

        return next()
    }

    const color = req.query.color ?? 'black'

    if (/[^a-zA-Z0-9#]/.test(color)) {
        res.status(HTTP_ERROR_BAD_REQUEST)
        res.json({ error: 'invalid color' })

        return next()
    }

    try {
        const svgString = await tex2svg(math, width, color)
        const pngBuffer = await svg2png(svgString)

        res.setHeader('cache-control', 's-maxage=604800, maxage=604800')
        res.contentType('image/png')
        res.end(pngBuffer)
    } catch (err) {
        res.status(HTTP_ERROR_BAD_REQUEST)
        res.json({ error: err })

        return next()
    }
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
