
import type { FastifyReply, FastifyRequest } from "fastify";
import "fastify"

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}