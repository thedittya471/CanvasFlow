import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  getLoggedInUserInfoInputModel,
  getLoggedInUserInfoInputOutputModel,
  SignInUserWithEmailAndPasswordInputModel,
  SignInUserWithEmailAndPasswordOutputModel,
  signOutInputModel,
  signOutOutputModel
} from "./model";
import { userService } from "../../services";
import { auth } from "../../auth";
import { TRPCError } from "@trpc/server";

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

      const response = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: fullName,
        },
        asResponse: true,
      })

      if (!response.ok) {
        const errBody: any = await response.json().catch(() => ({}))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errBody?.message || "Failed to create account",
        })
      }

      ctx.setHeaders(response.headers)

      const responseJson: any = await response.json()

      return {
        id: responseJson.user.id,
        token: ""
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

      const response = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        asResponse: true,
      })

      ctx.setHeaders(response.headers)

      const responseJson: any = await response.json()

      return {
        id: responseJson.user.id,
        token: ""
      }
    }),

  getLoggedInUserInfo: authenticatedProcedure.meta({
    openapi: {
      method: "GET",
      path: getPath("/getLoggedInUserInfo"),
      tags: TAGS,
      protect: true
    }
  })
    .input(getLoggedInUserInfoInputModel)
    .output(getLoggedInUserInfoInputOutputModel)
    .query(async ({ ctx }) => {
      const { id, email, name } = await userService.getUserInfoById(ctx.user.id)

      return {
        id,
        email,
        fullName: name
      }
    }),

  signOut: publicProcedure.meta({
    openapi: {
      method: "POST",
      path: getPath("/signOut"),
      tags: TAGS,
    }
  })
    .input(signOutInputModel)
    .output(signOutOutputModel)
    .mutation(async ({ ctx }) => {
      const response = await auth.api.signOut({
        headers: new Headers(ctx.req.headers as Record<string, string>),
        asResponse: true,
      })

      ctx.setHeaders(response.headers)

      return { success: true }
    })
});
