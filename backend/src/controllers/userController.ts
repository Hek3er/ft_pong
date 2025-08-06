import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { JWTPayload, getNameInterface, userPayload } from "../types/userTypes.js";
import { jsendError, jsendFail, jsendSuccess } from "../utils/jsend.js";


export const healthcheck = (req: FastifyRequest, res: FastifyReply) => {
  res.send(jsendSuccess(null))
};

export const getUsers = async (
  req: FastifyRequest,
  res: FastifyReply,
  server: FastifyInstance
) => {
  try {
    const result = await server.db.all("SELECT * FROM users");
    const users = result.map(({password, ...users}) => users)
    res.code(200).send(jsendSuccess({users}));
  } catch (err) {
    res.code(500).send(jsendError("coudn't get users"));
  }
};

export const getUserByName = async (
  req: FastifyRequest<{ Params: getNameInterface }>,
  res: FastifyReply,
  server: FastifyInstance
) => {
  const { username } = req.params;
  if (!username) {
    res.code(400).send(jsendFail(null, "Username parameter is required."));
  }
  try {
    const result = await server.db.get(
      "SELECT * FROM users WHERE username = ?",
      username
    );
    if (!result) {
      return res.code(404).send(jsendFail(null, "User not found."));
    }
    const {password, ...user} = result
    return res.send(jsendSuccess({user}));
  } catch (err) {
    console.error(err);
    return res.code(500).send(jsendError("User not found."));
  }
};

export const getCurrentUser = async (
  req: FastifyRequest,
  res: FastifyReply,
  server: FastifyInstance
) => {
  try {
    const decoded = (await req.jwtDecode()) as JWTPayload;
    const { username, email } = decoded;
    const result = await server.db.get("SELECT * FROM users WHERE username = ? AND email = ?", username, email) as userPayload;
    if (!result) {
      return res.code(404).send(jsendFail("user not found"))
    }
    const {password, ...user} = result
    return res.send(jsendSuccess({user}))
  } catch( err) {
    console.error(err);
    res.send(jsendError("coudn't get user"))
  }
  
};
