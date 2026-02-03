import winston from 'winston';
export declare const logger: {
    operation: {
        info: (message: string, metadata?: any) => winston.Logger;
        warn: (message: string, metadata?: any) => winston.Logger;
        error: (message: string, metadata?: any) => winston.Logger;
    };
    business: {
        info: (message: string, metadata?: any) => winston.Logger;
        warn: (message: string, metadata?: any) => winston.Logger;
        error: (message: string, metadata?: any) => winston.Logger;
    };
    error: {
        error: (message: string, metadata?: any) => winston.Logger;
        warn: (message: string, metadata?: any) => winston.Logger;
    };
};
