const { createLogger, format, transports } =  require('winston')

const { printf, combine, colorize, errors, label, timestamp } = format

const logFormat = printf(({ level, timestamp, message, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`
})

const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        label({ label: 'backend server' }),
        errors({ stack: true }),
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({
            filename: 'errors.log',
            level: 'error'
          }),
          new transports.File({
            filename: 'combined.log',
            level: 'info'
          }),
        new transports.Console()],
})

module.exports = { logger }