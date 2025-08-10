import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { getUserByEmail, addUser } from '../../../lib/data';
import { signToken, generateUserId } from '../../../lib/auth';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists
        let existingUser = await getUserByEmail(user.email);
        
        if (!existingUser) {
          // Create new user
          const newUser = {
            id: generateUserId(),
            name: user.name,
            email: user.email,
            role: 'customer',
            password: null, // No password for OAuth users
            provider: account.provider,
            providerId: account.providerAccountId
          };
          
          existingUser = await addUser(newUser);
        }
        
        // Generate JWT token
        const token = signToken({
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role
        });
        
        // Store token in user object for later use
        user.jwtToken = token;
        user.role = existingUser.role;
        user.dbId = existingUser.id;
        
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.jwtToken = user.jwtToken;
        token.role = user.role;
        token.dbId = user.dbId;
      }
      return token;
    },
    async session({ session, token }) {
      session.jwtToken = token.jwtToken;
      session.user.role = token.role;
      session.user.id = token.dbId;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home page after successful OAuth login
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});

