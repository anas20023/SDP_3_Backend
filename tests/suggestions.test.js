import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';


describe('Suggestions API', () => {
    // The database connection is handled globally in tests/setup.js

    describe('GET /api/suggestions', () => {
        it('should fetch all suggestions (Public Route)', async () => {
            const res = await request(app).get('/api/suggestions');
            
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('POST /api/suggestions', () => {
        it('should return 401 when creating suggestion without token', async () => {
            const res = await request(app)
                .post('/api/suggestions')
                .send({
                    course_code: 'CSE101',
                    course_name: 'Intro to Programming',
                    dept: 'CSE',
                    exam_type: 'Midterm'
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Authentication required');
        });
    });

    describe('POST /api/suggestions/:id/vote', () => {
        it('should return 401 when voting without token', async () => {
            const res = await request(app)
                .post('/api/suggestions/someid123/vote');

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Authentication required');
        });
    });
});
