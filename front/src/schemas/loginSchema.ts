import * as z from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .superRefine((password, ctx) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(
      password
    );

    if (!hasUpperCase) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one uppercase letter.",
      });
    }
    if (!hasLowerCase) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one lowecase letter.",
      });
    }
    if (!hasNumber) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one number.",
      });
    }
    if (!hasSpecialChar) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one special character.",
      });
    }
  });

export const loginSchema = z.object({
  email: z.email("Invalid Email").trim(),
  password: passwordSchema,
});

export type loginSchemaType = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  email: z.email("Invalid Email").trim(),
  password: passwordSchema
})

export type signupSchemaType = z.infer<typeof signupSchema>