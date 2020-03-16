import mjAPI from 'mathjax-node'

mjAPI.config({
  MathJax: {}
})

mjAPI.start()

const optimizeLineBreak = (math: string, width: number) => {
  let tokens = math.split('\\text{')
  let result = tokens.shift() as string

  for (const token of tokens) {
    let leftBracketCount = 0
    let buffer = ''

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < token.length; i++) {
      if (token[i] === '{') {
        buffer += '{'
        leftBracketCount++
      } else if (token[i] === '}') {
        if (leftBracketCount === 0) {
          if (buffer.length > width) {
            const count = Math.ceil(buffer.length / width)

            for (let j = 0; j < count; j++) {
              result += '\\text{' + buffer.substr(j * width, width) + '}'

              if (j !== count) {
                result += '\\\\'
              }
            }
          } else {
            result += '\\text{' + buffer + '}'
          }

          result += token.substr(i + 1)
          buffer = ''

          break
        } else {
          buffer += '}'
          leftBracketCount--
        }
      } else if (token[i] === '\\') {
        buffer += token[i + 1]
        i++
      } else {
        buffer += token[i]
      }
    }
  }

  return result
}

const EX_SIZE = 6

const tex2svg = (
  math: string,
  pxWidth: number,
  color: string
) => new Promise<string>((resolve, reject) => {
  const width = pxWidth / EX_SIZE

  mjAPI.typeset({
    ex: EX_SIZE,
    math: optimizeLineBreak(math, width),
    format: 'inline-TeX',
    svg: true,
    width,
    linebreaks: true
  }, (data: any) => {
    if (!data.errors) {
      resolve(data.svg.replace(/fill="currentColor"/, `fill="${color}"`))
    } else {
      reject(data.errors)
    }
  })
})

export default tex2svg
