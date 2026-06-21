import { trpc } from '~/trpc/client'

export const useSignUp = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status
    } = trpc.auth.createUserWithEmailAndPassword.useMutation({
        onSuccess: async (data) => {
            if (data?.token) {
                document.cookie = `authentication-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
            }
            await utils.auth.getLoggedInUserInfo.invalidate()
        }
    })

    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status,
        failureCount
    }
}

export const useSignIn = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status
    } = trpc.auth.signInUserWithEmailAndPassword.useMutation({
        onSuccess: async (data) => {
            if (data?.token) {
                document.cookie = `authentication-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
            }
            await utils.auth.getLoggedInUserInfo.invalidate()
        }
    })

    return {
        signInUserWithEmailAndPasswordAsync,
        signInUserWithEmailAndPassword,
        error,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status,
        failureCount
    }
}

export const useGetLoggedInUserInfo = () => {
    const {
        data: userInfo,
        error,
        failureCount,
        isError,
        isSuccess,
        status
    } = trpc.auth.getLoggedInUserInfo.useQuery()

    return {
        userInfo,
        error,
        isError,
        isSuccess,
        status,
        failureCount
    }
}

export const useSignOut = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: signOutAsync,
        mutate: signOut,
        error,
        isPending,
        isSuccess,
        status
    } = trpc.auth.signOut.useMutation({
        onSuccess: async () => {
            document.cookie = "authentication-token=; path=/; max-age=0; SameSite=Lax";
            utils.auth.getLoggedInUserInfo.setData(undefined, undefined)
        }
    })

    return {
        signOutAsync,
        signOut,
        error,
        isPending,
        isSuccess,
        status
    }
}
   