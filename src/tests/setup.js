const { sequelize } = require('../src/models'); // Import Sequelize instance

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset the database
});

afterAll(async () => {
    await sequelize.close(); // Close the database connection
});
