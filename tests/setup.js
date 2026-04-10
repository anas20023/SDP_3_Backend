import { jest, beforeAll, afterAll } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv();

// Global mock for external services
jest.unstable_mockModule('../src/services/checkStudentID.service.js', () => ({
    checkStudentID: jest.fn().mockResolvedValue({
        sis_std_name: 'Anas Ibn Belal',
        sis_std_intk: '52',
        sis_std_Status: 'R'
    })
}));

let mongoServer;



// Global setup before all tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Ensure we disconnect from any existing connections
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(uri);
});

// Global teardown after all tests
afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

// Optional: Clear database between tests for isolation
/*
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});
*/
