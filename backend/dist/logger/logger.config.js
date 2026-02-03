"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path = __importStar(require("path"));
const logDir = path.join(__dirname, '../../logs');
const customFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston_1.default.format.printf(({ timestamp, level, message, ...metadata }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}] ${message}`;
    if (Object.keys(metadata).length > 0) {
        logMessage += ` ${JSON.stringify(metadata)}`;
    }
    return logMessage;
}));
const operationLogger = winston_1.default.createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: path.join(logDir, 'operation.log'),
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
});
const businessLogger = winston_1.default.createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: path.join(logDir, 'business.log'),
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
});
const errorLogger = winston_1.default.createLogger({
    level: 'error',
    format: customFormat,
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: path.join(logDir, 'error.log'),
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
});
exports.logger = {
    operation: {
        info: (message, metadata) => operationLogger.info(message, metadata),
        warn: (message, metadata) => operationLogger.warn(message, metadata),
        error: (message, metadata) => operationLogger.error(message, metadata),
    },
    business: {
        info: (message, metadata) => businessLogger.info(message, metadata),
        warn: (message, metadata) => businessLogger.warn(message, metadata),
        error: (message, metadata) => businessLogger.error(message, metadata),
    },
    error: {
        error: (message, metadata) => errorLogger.error(message, metadata),
        warn: (message, metadata) => errorLogger.warn(message, metadata),
    },
};
//# sourceMappingURL=logger.config.js.map