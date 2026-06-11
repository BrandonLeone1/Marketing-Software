import { beforeEach, afterEach, afterAll, test, expect } from "vitest";
import request from 'supertest';
import app from "../src/app";
import { pool } from "../src/db";
import bcrypt from 'bcrypt'


afterAll(async () => {
    await pool.end();
})

const testUser = {
    email: "get-user@dev.com",
    password: "123123"
}

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
    `, [testUser.email, hashedPassword])

    const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({email: testUser.email, password: testUser.password})
    
    authCookie = loginResponse.headers['set-cookie'];
    userID = newUser.rows[0].id

})

afterEach(async () => {
    await pool.query(`
        DELETE FROM users
        WHERE email = $1    
    `, [testUser.email])
})



test("User can access only their campaigns", async () => {

    const campaignsResponse = await request(app)
    .get("/api/campaigns/get")
    .set('Cookie', authCookie)
    
    expect(campaignsResponse.status).toBe(200)
    expect(campaignsResponse.body.data.length).toBeLessThan(1);

})



