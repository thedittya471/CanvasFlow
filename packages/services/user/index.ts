import { createHmac, randomBytes } from "node:crypto"
import * as JWT from "jsonwebtoken"
import { db, eq } from "@repo/database"
import { usersTable } from "@repo/database/models/user"
import { type CreateUserWithEmailAndPasswordInputType, SignInUserWithEmailAndPasswordInput, SignInUserWithEmailAndPasswordInputType, createUserWithEmailAndPasswordInput, generateUserSessionTokenPayload, generateUserSessionTokenPayloadType } from './model'
import { env } from "../env"

class UserService {

  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email))
    if (!result || result.length === 0) return null
    return result[0]
  }

  private async generateUserSessionToken(payload: generateUserSessionTokenPayloadType) {
    const { id } = await generateUserSessionTokenPayload.parseAsync(payload)
    const token = JWT.sign({ id }, env.JWT_SECRET)
    return { token }
  }

  private async verifyUserToken(token: string): Promise<generateUserSessionTokenPayloadType> {
    try {
      const verificationResult = JWT.verify(token, env.JWT_SECRET) as generateUserSessionTokenPayloadType
      return verificationResult
    } catch (error) {
      throw new Error(`Invalid session token`)
    }
  }

  private async getUserInfoById(id: string) {
    const user = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      fullName: usersTable.fullName
    }).from(usersTable).where(eq(usersTable.id, id))

    if (!user || user.length === 0) throw new Error(`User with Id ${id} does not exist`)
    return user[0]!
  }

  private async generateHash(password: string, salt: string) {
    return createHmac('sha256', salt).update(password).digest('hex')
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } = await createUserWithEmailAndPasswordInput.parseAsync(payload)

    const existingUserWithEmail = await this.getUserByEmail(email)

    if (existingUserWithEmail) throw new Error(`user with email ${email} already exists`)

    const salt = randomBytes(16).toString('hex')
    const hash = await this.generateHash(password, salt)

    const userInsertResult = await db.insert(usersTable).values({ email, fullName, password: hash, salt }).returning({
      id: usersTable.id
    })

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error(`something went wrong while creating a user`)

    const userId = userInsertResult[0].id
    const { token } = await this.generateUserSessionToken({ id: userId })

    return {
      id: userId,
      token
    }
  }

  public async SignInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordInputType) {
    const { email, password } = await SignInUserWithEmailAndPasswordInput.parseAsync(payload)
    const existingUser = await this.getUserByEmail(email)

    if (!existingUser) throw new Error(`User with email ${email} does not exist`)

    if (!existingUser.salt || !existingUser.password) {
      throw new Error(`Invalid credentials`)
    }

    const hash = await this.generateHash(password, existingUser.salt)

    if (hash !== existingUser.password) throw new Error(`Invalid credentials`)

    const { token } = await this.generateUserSessionToken({ id: existingUser.id })

    return {
      id: existingUser.id,
      token
    }
  }

  public async verifyAndDecodeUserSessionToken(token: string) {
    const { id } = await this.verifyUserToken(token)
    const userInfo = await this.getUserInfoById(id)

    return { ...userInfo }

  }

}

export default UserService