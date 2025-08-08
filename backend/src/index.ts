import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import dotenv from "dotenv";
import { fpSqlitePlugin } from "fastify-sqlite-typed";
import { handleRoutes } from "./routes/userRoutes.js";
import { initDatabase } from "./config/db.js";
import { jwtPlugin } from "./plugins/jwt.js";
import { handleAuthRoutes } from "./routes/authRoutes.js";
import corsPlugin from "./plugins/cors.js";

const versioning = "/api/v1/";

dotenv.config();
const server = fastify({ logger: true });

server.register(fpSqlitePlugin, { dbFilename: "data.db" });
server.register(corsPlugin)
server.register(jwtPlugin);
server.register(handleRoutes, { prefix: versioning + "users" });
server.register(handleAuthRoutes, { prefix: versioning + "auth" });

const start = async () => {
  await server.ready();
  await initDatabase(server);
  await server.listen({ port: 3001, host: "0.0.0.0" });
};

start();
