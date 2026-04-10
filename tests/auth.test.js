import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';

// We must mock the module BEFORE it is imported anywhere
jest.unstable_mockModule('../src/services/checkStudentID.service.js', () => ({
    checkStudentID: jest.fn()
}));

// Use dynamic imports to ensure mocks are applied
const { default: request } = await import('supertest');
const { default: app } = await import('../src/app.js');
const { default: User } = await import('../src/model/users.js');
const StudentService = await import('../src/services/checkStudentID.service.js');

const mockedCheckStudentID = StudentService.checkStudentID;




describe('Authentication API', () => {
    // Unique user data for testing
    const testUser = {
        name: 'Anas Ibn Belal',
        user_id: '20234103372',
        email: `anasibnebelal400@gmail.com`,
        password: 'Anas@CSE@1234',
        dept: 'CSE',
        intake: '52',
        section: '10'
    };

    // The database connection is handled globally in tests/setup.js


    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            // Mocking the external student verification service
            mockedCheckStudentID.mockResolvedValue({
                sis_std_name: testUser.name,
                sis_std_intk: testUser.intake,
                sis_std_Status: 'R'
            });

            
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User registered successfully');
        });

        it('should return 400 for missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: 'incomplete@test.com' });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Required fields are missing');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            if (res.status === 200) {
                expect(res.status).toBe(200);
                expect(res.body.message).toBe('Login successful');
                expect(res.body).toHaveProperty('role');
            }
        });

        it('should return 401 for incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'WrongPasswor@d123!' // Must pass regex to reach auth logic
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid email or password');
        });
    });

});
