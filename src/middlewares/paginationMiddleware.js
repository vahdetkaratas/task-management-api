module.exports = (dataKey) => {
    return (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        if (endIndex < req[dataKey].length) {
            results.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            results.previous = { page: page - 1, limit };
        }

        results.data = req[dataKey].slice(startIndex, endIndex);
        req.paginatedResults = results;

        next();
    };
};
