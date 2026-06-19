import { z } from "zod";
import { getAuthenticationMethodOutputSchema } from "./model";

type AuthenticationMethod = z.infer<typeof getAuthenticationMethodOutputSchema>;

export default class UserService {
  async getAuthenticationMethods(): Promise<readonly AuthenticationMethod[]> {
    return [
      {
        id: "google",
        name: "Google",
        type: "oauth",
        loginUrl: "/api/auth/google",
      },
    ];
  }
}
