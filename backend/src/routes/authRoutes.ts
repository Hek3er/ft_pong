import type { FastifyInstance, FastifyRequest } from "fastify";
import type { loginSchemaType } from "../schemas/loginSchema.js";
import { createUser, login } from "../controllers/authController.js";

export const handleAuthRoutes = (server: FastifyInstance) => {
  server.post(
    "/signup",
    (req: FastifyRequest<{ Body: loginSchemaType }>, res) => {
      createUser(req, res, server);
    }
  );
  server.post("/login", (req: FastifyRequest<{ Body: loginSchemaType }>, res) => {
    login(req, res, server)
  });
  server.post("/refresh", () => {});
};
