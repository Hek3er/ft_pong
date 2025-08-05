import type { FastifyInstance, FastifyRequest } from "fastify";
import {
  createUser,
  getUserByName,
  getUsers,
  healthcheck,
} from "../controllers/userController.js";
import type { loginSchemaType } from "../schemas/loginSchema.js";
import type { getNameInterface } from "../types/userTypes.js";

export const handleRoutes = (server: FastifyInstance) => {
  //should add the middleware to check for auth
  server.get("/search/", (req, res) => {
    getUsers(req, res, server);
  });
  server.get(
    "/search/:name",
    (req: FastifyRequest<{ Params: getNameInterface }>, res) => {
      getUserByName(req, res, server);
    }
  );
  server.get("/healthcheck", healthcheck);
  server.post("/", (req: FastifyRequest<{ Body: loginSchemaType }>, res) => {
    createUser(req, res, server);
  });
  server.delete("/", () => {});
};
