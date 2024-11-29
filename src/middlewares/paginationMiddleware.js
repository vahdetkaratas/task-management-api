const { Op } = require('sequelize');

module.exports = (model, filterableFields = [], rangeFields = []) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
      // Build the where clause dynamically
      const where = {};

      // Exact match filters
      filterableFields.forEach(field => {
        if (req.query[field]) {
          where[field] = req.query[field];
        }
      });

      // Range filters
      rangeFields.forEach(field => {
        if (req.query[`${field}Min`] || req.query[`${field}Max`]) {
          where[field] = {
            ...(req.query[`${field}Min`] && { [Op.gte]: req.query[`${field}Min`] }),
            ...(req.query[`${field}Max`] && { [Op.lte]: req.query[`${field}Max`] }),
          };
        }
      });

      // Sorting
      const order = [];
      if (req.query.sortBy) {
        const sortOrder = req.query.order === 'desc' ? 'DESC' : 'ASC';
        order.push([req.query.sortBy, sortOrder]);
      }

      // Fetch total count and paginated results
      const total = await model.count({ where });
      const data = await model.findAll({
        where,
        limit,
        offset,
        order,
        include: [ // Include associated models
          {
            model: require('../../models').User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: require('../../models').TaskHistory,
            as: 'histories',
            attributes: ['id', 'changeType', 'oldValue', 'newValue', 'changeDate'],
          },
        ],
      });

      // Pagination metadata
      const results = {
        data,
        total,
      };
      if (offset + limit < total) {
        results.next = { page: page + 1, limit };
      }
      if (offset > 0) {
        results.previous = { page: page - 1, limit };
      }

      req.paginatedResults = results;

      next();
    } catch (error) {
      console.error('Error in pagination middleware:', error.message);
      res.status(500).json({ message: 'Error processing pagination', error: error.message });
    }
  };
};
