import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'
import { connectDb } from '@/lib/connectDb'

interface CredentialsInput {
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  company?: string
  password: string
  accountType?: string
  agreeToTerms?: string
  subscribeNewsletter?: string
  role?: string
  isSignUp?: string
  redirect?: string
  callbackUrl?: string
}

export const authOptions: NextAuthOptions = {
  debug: true,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        firstName: { label: 'First Name', type: 'text' },
        lastName: { label: 'Last Name', type: 'text' },
        email: { label: 'Email', type: 'email' },
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
        agreeToTerms: { label: 'Agree To Terms', type: 'checkbox' },
        role: { label: 'Role', type: 'text' },
        isSignUp: { label: 'Is Sign Up', type: 'text' },
      },

      async authorize(credentials) {
        const {
          firstName,
          lastName,
          email,
          phone,
          password,
          agreeToTerms,
          role,
          isSignUp,
        } = credentials as CredentialsInput

        if (!email || !password) throw new Error('Email and password required')

        const db = await connectDb()
        const usersCollection = db.collection('users')

        const signingUp = isSignUp === 'true'

        // --- Sign up flow ---
        if (signingUp) {
          const existingUser = await usersCollection.findOne({ email })
          if (existingUser) throw new Error('User already exists')

          const hashedPassword = await bcrypt.hash(password, 10)

          const newUser = {
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            agreeToTerms: agreeToTerms === 'true',
            role: role || 'user',
            createdAt: new Date().toISOString(),
          }

          const result = await usersCollection.insertOne(newUser)

          return {
            id: result.insertedId.toString(),
            email,
            name:
              firstName || lastName
                ? `${firstName || ''} ${lastName || ''}`.trim()
                : email.split('@')[0],
            role: newUser.role,
            image: null,
          }
        }

        // --- Login flow ---
        const user = await usersCollection.findOne({ email })
        if (!user) throw new Error('Invalid email or password')
        if (!user.password) throw new Error('Use Google/GitHub to sign in')

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('Invalid email or password')

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role || 'user',
          name:
            user.firstName || user.lastName
              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
              : user.email.split('@')[0],
          image: user.image || null,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.name = user.name
        token.image = user.image || null
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string | null
      }
      return session
    },
  },

  pages: {
    signIn: '/auth/sign-in',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
}
