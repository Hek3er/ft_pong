import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  getCurrentUser,
  getUserByName,
  getUsers,
  healthcheck,
} from "../controllers/userController.js";
import type { getNameInterface } from "../types/userTypes.js";

export const handleRoutes = (server: FastifyInstance) => {
  //should add the middleware to check for auth
  server.get("/all", { onRequest: [server.authenticate] }, (req, res) => {
    getUsers(req, res, server);
  });

  server.get(
    "/:username",
    { onRequest: [server.authenticate] },
    (req: FastifyRequest<{ Params: getNameInterface }>, res) => {
      getUserByName(req, res, server);
    }
  );

  server.get("/me", {onRequest: [server.authenticate]}, (req: FastifyRequest, res: FastifyReply) => {
    getCurrentUser(req, res, server)
  })
  server.delete("/", () => {});
};
