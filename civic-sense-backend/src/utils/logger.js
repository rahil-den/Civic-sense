const getTimestamp = () => new Date().toISOString();

export const logInfo = (message, context = {}) => {
    console.log(JSON.stringify({
        level: 'INFO',
        timestamp: getTimestamp(),
        message,
        ...context
    }));
};

export const logError = (message, error, context = {}) => {
    console.error(JSON.stringify({
        level: 'ERROR',
        timestamp: getTimestamp(),
        message,
        error: error.message || error,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        ...context
    }));
};

export const logWarn = (message, context = {}) => {
    console.warn(JSON.stringify({
        level: 'WARN',
        timestamp: getTimestamp(),
        message,
        ...context
    }));
};
