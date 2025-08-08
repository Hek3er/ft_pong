"use client";
import { loginSchemaType, loginSchema, signupSchemaType, signupSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { signup } from "./signup";
import { useState } from "react";
import { JSendResponse } from "@/types/jsend";

export default function Signup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<signupSchemaType>({ resolver: zodResolver(signupSchema) });

  const [usedError, setUsedError] = useState(false)
  const [usedMessage, setUsedMessage] = useState("")
  const [success, setSuccess] = useState(false)


  const onSubmit: SubmitHandler<signupSchemaType> = async  (data) => {
    console.log(data)
    const result = await signup(data) as JSendResponse
    console.log(result)
    if (result.status !== "success") {
      setUsedError(true)
      setUsedMessage(result.message!)
      setSuccess(false)
    } else {
      setUsedError(false)
      setUsedMessage("")
      setSuccess(true)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 p-4 w-[40%] flex flex-col gap-4 rounded"
      >
        {usedError && (
          <div className="text-center text-red-500">{usedMessage}</div>
        )}
        <input
          {...register("username")}
          type="text"
          placeholder="username"
          className="border-2 rounded py-2 p-2"
        />
        {errors.username && (
          <div className="pl-4 text-red-500">- {errors.username.message}</div>
        )}
        
        <input
          {...register("email")}
          type="text"
          placeholder="email"
          className="border-2 rounded py-2 p-2"
        />
        {errors.email && (
          <div className="pl-4 text-red-500">- {errors.email.message}</div>
        )}
        <input
          {...register("password")}
          type="password"
          placeholder="password"
          className="border-2 rounded py-2 p-2"
        />
        {errors.password && (
          <div className="pl-4 text-red-500">- {errors.password.message}</div>
        )}
        <input
          disabled={isSubmitting}
          type="submit"
          value="Signup"
          className="border-2 rounded py-3 bg-blue-500 disabled:bg-blue-300"
        />
        {success && (<div className="text-center text-green-500">Logged in</div>)}
      </form>
    </div>
  );
}
