import svg2img from 'svg2img'

const svg2png = (svgString: string) =>
    new Promise((resolve, reject) => {
        svg2img(svgString, (error: any, buffer: Buffer) => {
            if (error) {
                reject(error)
            } else {
                resolve(buffer)
            }
        })
    })

export default svg2png
