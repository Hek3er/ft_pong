import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";

export const jwtPlugin = fp(
  async (server: FastifyInstance, opts: FastifyPluginOptions) => {
    server.register(fastifyJwt, {
      secret: process.env.JWT_SECRET || "supersecret",
    });

    server.decorate(
      "authenticate",
      async (req: FastifyRequest, res: FastifyReply) => {
        try {
          await req.jwtVerify();
        } catch (err) {
          res.send(err);
        }
      }
    );
  }
);
