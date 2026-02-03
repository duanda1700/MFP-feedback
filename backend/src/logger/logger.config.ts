import winston from 'winston';
import * as path from 'path';

// 创建日志目录路径
const logDir = path.join(__dirname, '../../logs');

// 自定义日志格式
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}] ${message}`;
    if (Object.keys(metadata).length > 0) {
      logMessage += ` ${JSON.stringify(metadata)}`;
    }
    return logMessage;
  }),
);

// 创建操作日志记录器
const operationLogger = winston.createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'operation.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// 创建业务日志记录器
const businessLogger = winston.createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'business.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// 创建错误日志记录器
const errorLogger = winston.createLogger({
  level: 'error',
  format: customFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// 导出日志记录器
export const logger = {
  // 操作日志
  operation: {
    info: (message: string, metadata?: any) => operationLogger.info(message, metadata),
    warn: (message: string, metadata?: any) => operationLogger.warn(message, metadata),
    error: (message: string, metadata?: any) => operationLogger.error(message, metadata),
  },
  // 业务日志
  business: {
    info: (message: string, metadata?: any) => businessLogger.info(message, metadata),
    warn: (message: string, metadata?: any) => businessLogger.warn(message, metadata),
    error: (message: string, metadata?: any) => businessLogger.error(message, metadata),
  },
  // 错误日志
  error: {
    error: (message: string, metadata?: any) => errorLogger.error(message, metadata),
    warn: (message: string, metadata?: any) => errorLogger.warn(message, metadata),
  },
};
