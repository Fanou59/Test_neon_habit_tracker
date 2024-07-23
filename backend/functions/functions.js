import pg from "pg";
const { Pool } = pg;
import { pool } from "../app.js";

export const executeQuery = async (query, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (err) {
    reply.status(500).send(err);
  } finally {
    client.release();
  }
};
