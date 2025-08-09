import { loginSchemaType } from "@/schemas/loginSchema";

export const loginUser = async (data: loginSchemaType) => {
  console.log("fdf")
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
    const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + "auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })
    return await result.json()
}