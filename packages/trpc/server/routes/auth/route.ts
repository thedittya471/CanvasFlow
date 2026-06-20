import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  getLoggedInUserInfoInputModel,
  getLoggedInUserInfoInputOutputModel,
  signInInputModel,
  signInOutputModel,
  SignInUserWithEmailAndPasswordInputModel,
  SignInUserWithEmailAndPasswordOutputModel
} from "./model";
import { userService } from "../../services";
import { getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";
import { SignInUserWithEmailAndPasswordInput } from "@repo/services/user/model";
import { usersTable } from "../../../../database/models/user";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure.meta({
    openapi: {
      method: 'POST',
      path: getPath("/createUserWithEmailAndPassword"),
      tags: TAGS,
    }
  })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input

      const { id, token } = await userService.createUserWithEmailAndPassword({
        fullName, email, password
      })

      setAuthenticationCookie(ctx, token)

      return {
        id
      }
    }),

  signInUserWithEmailAndPassword: publicProcedure.meta({
    openapi: {
      method: 'POST',
      path: getPath("/signInUserWithEmailAndPassword"),
      tags: TAGS,
    }
  })
    .input(SignInUserWithEmailAndPasswordInputModel)
    .output(SignInUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input

      const { id, token } = await userService.SignInUserWithEmailAndPassword({ email, password })

      setAuthenticationCookie(ctx, token)

      return {
        id
      }
    }),

  getLoggedInUserInfo: publicProcedure.meta({
    openapi: {
      method: "GET",
      path: getPath("/getLoggedInUserInfo"),
      tags: TAGS,
    }
  })
    .input(getLoggedInUserInfoInputModel)
    .output(getLoggedInUserInfoInputOutputModel)
    .query(async ({ ctx }) => {
      const userToken = getAuthenticationCookie(ctx)
      if (!userToken) throw new Error(`user is not logged in`)

      const { id, email, fullName } = await userService.verifyAndDecodeUserSessionToken(userToken)

      return {
        id,
        email,
        fullName
      }
    })
});
