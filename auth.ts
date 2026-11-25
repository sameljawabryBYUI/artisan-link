import GitHub from 'next-auth/providers/github';
import NextAuth from 'next-auth';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ account, profile }) {
      if (!account?.providerAccountId) return false;

      await connectToDatabase();
      await User.findOneAndUpdate(
        { githubId: account.providerAccountId },
        {
          $setOnInsert: {
            githubId: account.providerAccountId,
            name: profile?.name || profile?.login || 'ArtisanLink User',
            role: 'buyer',
            avatarUrl: profile?.avatar_url || undefined,
          },
        },
        { upsert: true, new: true }
      );

      return true;
    },
    async jwt({ token, account }) {
      if (account?.providerAccountId) {
        await connectToDatabase();
        const user = await User.findOne({ githubId: account.providerAccountId }).lean();
        if (user) {
          token.userId = user._id.toString();
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.userId === 'string') {
        session.user.id = token.userId;
        session.user.role = token.role as 'buyer' | 'artisan';
      }
      return session;
    },
  },
});
