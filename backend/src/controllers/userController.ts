import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginSchema, type loginSchemaType } from "../schemas/loginSchema.js";
import * as z from "zod";

export const healthcheck = (req: FastifyRequest, res: FastifyReply) => {
  return { message: "success" };
};

export const getUsers = async (
  req: FastifyRequest,
  res: FastifyReply,
  server: FastifyInstance
) => {
  try {
    const users = await server.db.all("SELECT * FROM users");
    res.code(200).send(users);
  } catch (err) {
    res.code(500).send({ message: "coudn't get users" });
  }
};

export const createUser = async (
  req: FastifyRequest<{ Body: loginSchemaType }>,
  res: FastifyReply,
  server: FastifyInstance
) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return res.code(400).send(errorMessages);
  }
  try {
    const { name, email, password } = req.body;
    await server.db.run(
      "INSERT INTO users (name, email, password) VALUES(?, ?, ?)",
      name,
      email,
      password
    );
    res.code(201).send({ message: "user created" });
  } catch (err) {
    res.code(500).send({ message: "failed to create user" });
  }
};
