import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { JWTPayload, getNameInterface } from "../types/userTypes.js";


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



export const getUserByName = async (
  req: FastifyRequest<{ Params: getNameInterface }>,
  res: FastifyReply,
  server: FastifyInstance
) => {
  const { username } = req.params;
  if (!username) {
    res.code(400).send({ message: "Username parameter is required." });
  }
  try {
    const user = await server.db.get(
      "SELECT * FROM users WHERE username = ?",
      username
    );
    console.log(user);
    if (!user) {
      return res.code(404).send({ message: "User not found." });
    }
    return res.send(user);
  } catch (err) {
    console.error(err);
    return res.code(500).send({ message: "Coudn't find user" });
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
    const user = await server.db.get("SELECT * FROM users WHERE username = ? AND email = ?", username, email);
    if (!user) {
      return res.code(404).send({message: "user not found"})
    }
    return res.send(user)
  } catch( err) {
    console.error(err);
    res.send(err)
  }
  
};
