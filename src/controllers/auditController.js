const auditLogs = []; // Temporary in-memory storage for logs

// Add a new audit log entry
exports.logAction = (action, userId) => {
    const log = {
        timestamp: new Date(),
        userId,
        action
    };
    auditLogs.push(log);
};

// Get all audit logs (admin only)
exports.getLogs = (req, res) => {
    res.status(200).json(auditLogs);
};
