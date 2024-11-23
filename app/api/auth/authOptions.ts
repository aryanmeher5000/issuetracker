import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/client";
import { NextAuthConfig } from "next-auth";

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          return {
            ...token,
            role: dbUser.role,
            id: dbUser.id,
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};

export default authOptions;
