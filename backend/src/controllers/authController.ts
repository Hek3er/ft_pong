import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { loginSchema, type loginSchemaType } from "../schemas/loginSchema.js";
import { comparePassword, hashPassword } from "../utils/hashing.js";
import type { userPayload } from "../types/userTypes.js";
import { jsendError, jsendFail, jsendSuccess } from "../utils/jsend.js";
import * as z from "zod"

function mapZodErrorsToJsend(error: z.ZodError) {
    const fieldErrors: Record<string, string[]> = {};
  
    for (const issue of error.issues) {
      const field = issue.path.join(".");
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field]!.push(issue.message);
    }
  
    return {
      status: "fail",
      data: fieldErrors,
    };
  }
  

export const createUser = async (
  req: FastifyRequest<{ Body: loginSchemaType }>,
  res: FastifyReply,
  server: FastifyInstance
) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.code(400).send(mapZodErrorsToJsend(result.error));
  }
  try {
    const { username, email, password } = req.body;
    
    if (await server.db.get("SELECT * FROM users WHERE username = ?", username) !== undefined) {
        return res.code(409).send(jsendFail(null, "username already exists"))    
    }
    if (await server.db.get("SELECT * FROM users WHERE email = ? ", email) !== undefined) {
        return res.code(409).send(jsendFail(null, "email already exists"))
    }

    const hash = await hashPassword(password);

    await server.db.run(
      "INSERT INTO users (username, email, password) VALUES(?, ?, ?)",
      username,
      email,
      hash
    );

    res.code(201).send(jsendSuccess(null));
  } catch (err) {
    console.error(err);
    res.code(500).send(jsendError("failed to create user"));
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
    return res.code(400).send(jsendFail(errorMessages));
  }
  try {
    const { username, email, password } = req.body;
    const user = (await server.db.get(
      "SELECT * FROM users WHERE username = ? AND email = ? ",
      username,
      email
    )) as userPayload;
    if (!user) {
      return res.code(404).send(jsendFail(null, "failed to find user"));
    }

    const compared = await comparePassword(password, user.password);
    if (!compared) {
      return res.code(401).send(jsendFail(null, "password incorrect"));
    }
    const token = server.jwt.sign(user);
    res.send(jsendSuccess({token}));
  } catch (err) {
    console.error(err);
    res.code(500).send(jsendError("Failed to login", 500, {err}));
  }
};
