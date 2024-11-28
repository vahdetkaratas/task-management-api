const { logAction } = require('../controllers/auditController');

module.exports = (action) => {
    return (req, res, next) => {
        logAction(action, req.user?.id);
        next();
    };
};
