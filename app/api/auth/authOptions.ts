import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/client";
import { NextAuthConfig } from "next-auth";

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to the JWT token during login
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.role = dbUser.role; // Assuming 'role' is in your User model
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Propagate role from JWT token to session object
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};

export default authOptions;
