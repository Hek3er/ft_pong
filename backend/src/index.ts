import fastify from "fastify";
import dotenv from "dotenv";
import { fpSqlitePlugin } from "fastify-sqlite-typed";
import { handleRoutes } from "./routes/userRoutes.js";
import { initDatabase } from "./config/db.js";
import fastifyJwt from "@fastify/jwt";

dotenv.config();
const server = fastify({ logger: true });

server.register(fpSqlitePlugin, { dbFilename: "data.db" });
server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "supersecret", // 7ayed hadi 
});
server.register(handleRoutes, { prefix: "/api/v1" });

const start = async () => {
  await server.ready();
  await initDatabase(server);
  await server.listen({ port: 3001, host: "0.0.0.0" });
};

start();
