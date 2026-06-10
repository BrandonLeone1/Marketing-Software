import {afterAll, expect, test} from 'vitest';
import request from 'supertest';
import app from '../src/app'
import { pool } from '../src/db';
import { afterEach, beforeEach } from 'vitest';
import bcrypt from 'bcrypt'

const testUser = {
    email: "testUser@dev.com",
    password: "123123"
}

beforeEach(async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    
        await pool.query(`
        INSERT INTO users (email, password_hashed)
        VALUES ($1, $2)
        ON CONFLICT (email)
        DO NOTHING    
    `, [testUser.email, hashedPassword])
})

afterEach(async () => {
    await pool.query(`
        DELETE FROM users
        WHERE email = $1    
    `, [testUser.email])
})

afterAll(async () => {
    await pool.end()
})

test("Should return 400 when user does not exist", async () => {
    
    const response = await request(app)
    .post('/api/auth/login')
    .send({email: "doesnotexist@dev.com", password: "123123"})

    expect(response.status).toBe(400)
    expect(response.body).toEqual({success: false, message: "Invalid email or password"})

})

test("Should return 200 when user logins successfully", async () => {

    const response = await request(app)
    .post('/api/auth/login')
    .send({email: testUser.email, password: testUser.password})

    expect(response.status).toBe(200)
    expect(response.body).toEqual({success: true, message: "Sent cookie"})
})

test("Should return 400 when wrong password is given", async () => {
    
    const response = await request(app)
    .post('/api/auth/login')
    .send({email: testUser.email, password: "wrong"})

    expect(response.status).toBe(400)
    expect(response.body).toEqual({success: false, message: "Invalid email or password"})
})