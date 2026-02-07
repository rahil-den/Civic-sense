export const logAction = (actorId, action, targetType, targetId) => {
    const logEntry = {
        timestamp: new Date(),
        actorId,
        action,
        targetType,
        targetId
    };

    // In a real production system, this would write to a 'audit_logs' collection in MongoDB
    // or send to a dedicated logging service.

    console.log(`[AUDIT] ${JSON.stringify(logEntry)}`);
};
