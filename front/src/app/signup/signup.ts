import { signupSchemaType } from "@/schemas/loginSchema";

export const signup = async (data: signupSchemaType) => {
  const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + "auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  return await result.json();
}