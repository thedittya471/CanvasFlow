import { z } from 'zod'

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters").describe("full name of the user"),
    email: z.string().email("Please enter a valid email address").describe("email of user"),
    password: z.string().min(8, "Password must be at least 8 characters").describe("password of user")
})

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id of the user created"),
    token: z.string().describe("authentication token")
})

export const signInInputModel = z.object({
    email: z.string().email("Please enter a valid email address").describe("email of user"),
    password: z.string().min(8, "Password must be at least 8 characters").describe("password of user")
})

export const signInOutputModel = z.object({
    token: z.string().describe("jwt token or session id")
})

export const SignInUserWithEmailAndPasswordInputModel = z.object({
    email: z.string().describe('email of the user'),
    password: z.string().describe('password of the user')
})

export const SignInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe('id of the user'),
    token: z.string().describe("authentication token")
})

export const getLoggedInUserInfoInputModel = z.undefined()

export const getLoggedInUserInfoInputOutputModel = z.object({
    id: z.string().describe('id of the user'),
    fullName: z.string().describe('name of the user'),
    email: z.string().email().describe('email of the user')
})

export type GetLoggedInUserInfoInputModelType = z.infer<typeof getLoggedInUserInfoInputModel>
export type GetLoggedInUserInfoInputOutputModelType = z.infer<typeof getLoggedInUserInfoInputOutputModel>

export const signOutInputModel = z.object({}).optional()
export const signOutOutputModel = z.object({
    success: z.boolean()
})

