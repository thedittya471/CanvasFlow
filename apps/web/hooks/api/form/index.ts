import { trpc } from "~/trpc/client"

export const useCreateForm = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    })

    return {
        createFormAsync,
        createForm,
        error,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status,
        failureCount
    }
}

export const useListFormsByUserId = () => {
    const {
        data: forms,
        error,
        failureCount,
        isError,
        isSuccess,
        status,
        isLoading,
        refetch
    } = trpc.form.listFormsByUserId.useQuery()

    return {
        forms,
        error,
        isError,
        isSuccess,
        status,
        failureCount,
        isLoading,
        refetch
    }
}
