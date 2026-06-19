import { z } from "zod";

export const getAuthenticationMethodOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["oauth", "credentials", "email"]),
  loginUrl: z.string().optional(),
});
