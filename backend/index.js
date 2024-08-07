import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import cors from "@fastify/cors";
import pg from "pg";
import { executeQuery } from "./functions/functions.js";
import routes from "./routes/routes.js";

const { Pool } = pg;
const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

await fastify.register(routes);

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});
fastify.get("/", async (request, reply) => {
  reply.send({ hello: "world" });
});

// vérification de la version de la dB
const getPgVersion = async () => {
  try {
    const result = await executeQuery("SELECT version()", []);
    console.log(result[0]);
  } catch (err) {
    console.error("Error fetching PostgreSQL version:", err);
  }
};

getPgVersion();

export default async function handler(req, reply) {
  await fastify.ready();
  fastify.server.emit("request", req, reply);
}
