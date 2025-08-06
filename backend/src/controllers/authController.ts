import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { loginSchema, type loginSchemaType } from "../schemas/loginSchema.js";
import { comparePassword, hashPassword } from "../utils/hashing.js";
import type { userPayload } from "../types/userTypes.js";

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
    const { username, email, password } = req.body;
    const hash = await hashPassword(password);

    await server.db.run(
      "INSERT INTO users (username, email, password) VALUES(?, ?, ?)",
      username,
      email,
      hash
    );

    res.code(201).send({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.code(500).send({ message: "failed to create user" });
  }
};

export const login = async (
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
    const { username, email, password } = req.body;
    const user = (await server.db.get(
      "SELECT * FROM users WHERE username = ? AND email = ? ",
      username,
      email
    )) as userPayload;
    if (!user) {
      return res.code(404).send({ message: "User not found" });
    }
    console.log(`=>>>>>>>>>>>> ${password} - ${user.password} - ${user}`)
    const compared = await comparePassword(password, user.password);
    if (!compared) {
      return res.code(401).send({ message: "Password is wrong" });
    }
    const token = server.jwt.sign(user);
    res.send({ token });
  } catch (err) {
    console.error(err);
    res.code(500).send({ message: "Failed to sign in" });
  }
};
