import type { FastifyInstance, FastifyRequest } from "fastify";
import { createUser, getUsers, healthcheck } from "../controllers/userController.js";
import type { loginSchemaType } from "../schemas/loginSchema.js";

export const handleRoutes = (server : FastifyInstance) => {
    //should add the middleware to check for auth
    server.get("/", (req, res) => {
        getUsers(req, res, server)
    })
    server.get("/healthcheck", healthcheck)
    server.post("/", (req : FastifyRequest<{Body: loginSchemaType}>, res) => {
        createUser(req, res, server)
    })
    server.delete("/", () => {})
}