const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

const warn = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn(...params)
  }
}

export default  {
    info,
    error,
    warn,
}