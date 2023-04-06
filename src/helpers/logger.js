const { createLogger, format, transports } =  require('winston')

const { printf, combine, colorize, errors, label, timestamp } = format

const logFormat = printf(({ level, timestamp, message, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`
})

const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 1000000,
        maxFiles: 5,
        tailable: true
      }),
      new transports.File({
        filename: 'logs/combined.log',
        maxsize: 1000000,
        maxFiles: 5,
        tailable: true
      })
    ]
})

module.exports = { logger }