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
        onSuccess: async () => {
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
        onSuccess: async () => {
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