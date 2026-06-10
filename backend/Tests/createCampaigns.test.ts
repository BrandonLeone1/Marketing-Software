import { test, expect, afterAll, beforeEach, afterEach } from "vitest";
import { pool } from "../src/db";


afterAll(async () => {
    await pool.end();
})