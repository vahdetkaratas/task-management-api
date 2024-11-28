const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Task Management API',
        version: '1.0.0',
        description: 'API documentation for the Task Management system'
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Development server'
        }
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    security: [
        {
            BearerAuth: []
        }
    ]
};

// Options for Swagger docs
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'] // Path to the API docs
};

// Initialize Swagger JSDoc
const swaggerSpec = swaggerJsDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
