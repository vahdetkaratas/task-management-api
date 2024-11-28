const request = require('supertest');
const app = require('../src/app');
const { User, Task, TaskAssignment } = require('../models');

describe('Task API', () => {
    let user, admin, token, adminToken, task;

    beforeAll(async () => {
        // Create test users
        user = await User.create({ name: 'Test User', email: 'user@example.com', password: 'password', role: 'user' });
        admin = await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' });

        // Generate tokens (use your JWT utility here)
        token = 'mocked-user-token'; // Replace with actual JWT generator
        adminToken = 'mocked-admin-token'; // Replace with actual JWT generator

        // Create a sample task
        task = await Task.create({ title: 'Sample Task', description: 'A task for testing', priority: 1, userId: user.id });
    });

    afterAll(async () => {
        await TaskAssignment.destroy({ where: {} });
        await Task.destroy({ where: {} });
        await User.destroy({ where: {} });
    });

    test('Create Task', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'New Task', description: 'Task description', priority: 2, dueDate: '2024-12-01', assignedUserIds: [user.id] });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Task created successfully');
    });

    test('Fetch Tasks', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('Update Task', async () => {
        const response = await request(app)
            .put(`/api/tasks/${task.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Updated Task Title', status: 'completed' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task updated successfully');
        expect(response.body.task.title).toBe('Updated Task Title');
    });

    test('Delete Task (Unauthorized)', async () => {
        const response = await request(app)
            .delete(`/api/tasks/${task.id}`)
            .set('Authorization', `Bearer ${adminToken}`); // Admin should not delete tasks owned by the user

        expect(response.status).toBe(403); // Adjust based on your authorization logic
    });

    test('Delete Task (Authorized)', async () => {
        const response = await request(app)
            .delete(`/api/tasks/${task.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task deleted successfully');
    });
});
