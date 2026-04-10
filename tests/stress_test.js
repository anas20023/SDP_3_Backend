import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users over 30s
        { duration: '1m', target: 20 },  // Stay at 20 users for 1m
        { duration: '20s', target: 0 },  // Ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
    },
};

const BASE_URL = 'http://localhost:3000/api';

export default function () {
    // 1. Stress Test - Fetch Suggestions (Public)
    let res = http.get(`${BASE_URL}/suggestions`);
    check(res, {
        'status is 200 (Suggestions)': (r) => r.status === 200,
    });
    sleep(1);

    // 2. Stress Test - Login (Auth Pressure)
    const loginPayload = JSON.stringify({
        email: 'anasibnebelal400@gmail.com',
        password: 'Anas@CSE@1234',
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    res = http.post(`${BASE_URL}/auth/login`, loginPayload, params);
    check(res, {
        'status is 200 (Login)': (r) => r.status === 200,
    });
    
    // If login successful, we could use the token for protected routes
    // But for a basic stress test, login pressure itself is valuable
    
    sleep(1);
}
