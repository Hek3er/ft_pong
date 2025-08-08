import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import cors from "@fastify/cors";
import fp from "fastify-plugin";

const corsPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  fastify.register(cors, {
    origin: (origin: string | undefined, cb) => {
      const allowedOrigins = ["http://localhost:3000"];
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error("Not Allowed By Cors"), origin);
    },
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: false,
  });
});
export default corsPlugin;