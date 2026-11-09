import winston from "winston";

const { combine, colorize, timestamp, printf } = winston.format;

const myLogger = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level} ${message}`;
});

const logger = winston.createLogger({
  level: "http",
  transports: [new winston.transports.Console()],
  format: combine(colorize(), timestamp(), myLogger),
});

export { logger };
