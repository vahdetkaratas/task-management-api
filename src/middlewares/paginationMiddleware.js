module.exports = (dataKey, filterableFields = []) => {
    return (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let data = req[dataKey];

        // Apply filtering
        if (filterableFields.length) {
            filterableFields.forEach(field => {
                if (req.query[field]) {
                    data = data.filter(item => item[field] === req.query[field]);
                }
            });
        }

        // Apply sorting
        if (req.query.sortBy) {
            const sortKey = req.query.sortBy;
            const sortOrder = req.query.order === 'desc' ? -1 : 1;

            data.sort((a, b) => {
                if (a[sortKey] < b[sortKey]) return -1 * sortOrder;
                if (a[sortKey] > b[sortKey]) return 1 * sortOrder;
                return 0;
            });
        }

        const results = {};
        if (endIndex < data.length) {
            results.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            results.previous = { page: page - 1, limit };
        }

        results.data = data.slice(startIndex, endIndex);
        req.paginatedResults = results;

        next();
    };
};
