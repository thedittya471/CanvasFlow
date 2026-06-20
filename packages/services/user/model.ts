import { z } from 'zod'

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().describe("Full name of the user"),
  email: z.string().email("Please enter a valid email address").describe("Email address of the user"),
  password: z.string().describe("Password of the user")
})

export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>

export const generateUserSessionTokenPayload = z.object({
  id: z.string().describe('uuid of the user')
})

export type generateUserSessionTokenPayloadType = z.infer<typeof generateUserSessionTokenPayload>

export const SignInUserWithEmailAndPasswordInput = z.object({
  email: z.email('Please enter a valid email address').describe('email of the user'),
  password: z.string().describe('password of the user')
})

export type SignInUserWithEmailAndPasswordInputType = z.infer<typeof SignInUserWithEmailAndPasswordInput>