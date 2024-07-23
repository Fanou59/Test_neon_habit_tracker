import {
  getData,
  createHabit,
  deleteHabit,
} from "../functions/queryFunctions.js";

export default async function (fastify, opts) {
  fastify.get("/data", getData);
  fastify.post("/data", createHabit);
  fastify.delete("/data/:id", deleteHabit);
}
