"use client";
import { loginSchema, loginSchemaType } from "@/schemas/loginSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from "./login";
import { useState } from "react";
import { JSendResponse, LoginData } from "@/types/jsend";

export default function login() {
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, reset, formState: {errors, isSubmitting} } = useForm<loginSchemaType>({resolver: zodResolver(loginSchema)});

  const onSubmit: SubmitHandler<loginSchemaType> = async (data) => {
    console.log(data);
    const result = await loginUser(data) as JSendResponse<LoginData>
    if (result.status === "success") {
      setSuccess(true)
    } else {
      setSuccess(false)
    }
    console.log(result.data.token)
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-1 p-4 w-[40%] flex flex-col gap-4"
      >
        <input
          {...register("email")}
          type="text"
          placeholder="email"
          className="border-1 rounded py-2 p-2"
        />
        {errors.email && (<div className="pl-4 text-red-500">{errors.email.message}</div>)}
        <input
          {...register("password")}
          type="password"
          placeholder="password"
          className="border-1 rounded py-2 p-2"
        />
        {errors.password && (<div className="pl-4 text-red-500">{errors.password.message}</div>)}
        <input
          disabled={isSubmitting}
          type="submit"
          value="Login"
          className="border-1 rounded py-3 bg-blue-500 disabled:bg-blue-300"
        />
        {success && (<div className="text-center text-green-500">Success</div>)}
      </form>
    </div>
  );
}
