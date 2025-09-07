import logger from "./logger.js"

export const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

export const unknownEndpoint = (request,response) => {
    return response.status(404).send({message:'Unknown Endpoint'})
}