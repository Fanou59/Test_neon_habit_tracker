import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import pg from "pg";

const { Pool } = pg;
const fastify = Fastify({
  logger: true,
});

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});
fastify.get("/", async (request, reply) => {
  reply.send({ hello: "world" });
});

fastify.get("/data", async (request, reply) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM habits_tracker");
    return result.rows;
  } catch (err) {
    reply.status(500).send(err);
  } finally {
    client.release();
  }
});

// Route POST pour créer une nouvelle entrée
fastify.post("/data", async (request, reply) => {
  const { name, date, checked } = request.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO habits_tracker (name, date, checked) VALUES ($1, $2, $3) RETURNING *",
      [name, date, checked]
    );
    return result.rows[0];
  } catch (err) {
    reply.status(500).send(err);
  } finally {
    client.release();
  }
});

async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT version()");
    console.log(result.rows[0]);
  } finally {
    client.release();
  }
}

getPgVersion();

// Lancer le serveur Fastify
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
