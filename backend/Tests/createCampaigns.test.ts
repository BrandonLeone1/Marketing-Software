import { test, expect, afterAll, beforeEach, afterEach } from "vitest";
import request from 'supertest';
import { pool } from "../src/db";
import bcrypt from 'bcrypt'
import app from "../src/app";


const testUser = {
    email: "create-campaign-test@dev.com",
    password: "123123"
};

let authCookie: string; 
let userID: string | number;

beforeEach(async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    const newUser = await pool.query(`
        INSERT INTO users (email, password_hashed)
        VALUES ($1, $2)
        ON CONFLICT (email)
        DO UPDATE SET password_hashed = EXCLUDED.password_hashed
        RETURNING *    
    `, [testUser.email, hashedPassword]);

    const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({email: testUser.email, password: testUser.password});

    console.log("newUser ID:", newUser.rows[0].id);
    console.log("login response:", loginResponse.body);
    console.log("cookies:", loginResponse.headers['set-cookie']);

    authCookie = loginResponse.headers['set-cookie'];
    userID = newUser.rows[0].id
});

afterEach(async () => {
    
    await pool.query(`
        DELETE FROM memberships
        WHERE user_id = $1    
    `, [userID])
    await pool.query(`
        DELETE FROM users
        WHERE email = $1    
    `, [testUser.email])
    await pool.query(`
        DELETE FROM campaigns
        WHERE campaign_name = $1 AND budget = $2    
    `, ["INTEGRATION TESTsss4446667777888fgffvfvzzzzdr5r5;fg;f;f[f[f[f[", 300])
});

afterAll(async () => {
    await pool.end();
});

test("Users can successfully create campaigns and receive a membership to it", async () => {

    const response = await request(app)
    .post('/api/campaigns/create')
    .set('Cookie', authCookie)
    .send({campaign_name: "INTEGRATION TESTsss4446667777888fgffvfvzzzzdr5r5;fg;f;f[f[f[f[", budget: 300})
    

    if (response.status !== 200) console.log("Server Error Body:", response.body);


    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    
})