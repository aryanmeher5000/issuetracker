import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string; // Add your custom role field here
  }

  interface Session {
    user: {
      role: string; // Include custom field in the session user
    } & DefaultSession["user"];
  }

  interface JWT {
    role: string; // Include custom field in the JWT
  }
}
