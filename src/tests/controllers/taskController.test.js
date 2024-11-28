const request = require('supertest');
const app = require('../src/app');
const { User, Task } = require('../models');

describe('Task API', () => {
    let user, token;

    beforeAll(async () => {
        // Create a test user and generate a token
        user = await User.create({ name: 'Test User', email: 'test@example.com', password: 'password', role: 'user' });
        token = 'your_mock_jwt_token'; // Replace with a method to generate valid tokens
    });

    afterAll(async () => {
        await User.destroy({ where: {} });
        await Task.destroy({ where: {} });
    });

    test('Create Task', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test Task', description: 'Task description', priority: 1, dueDate: '2024-12-01', assignedUserIds: [user.id] });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Task created successfully');
    });
});
