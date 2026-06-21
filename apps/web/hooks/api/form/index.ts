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

export const useCreateFormField = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createFormFieldAsync,
        mutate: createFormField,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status
    } = trpc.form.createFormField.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    })

    return {
        createFormFieldAsync,
        createFormField,
        error,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status,
        failureCount
    }
}

export const useUpdateFormField = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: updateFormFieldAsync,
        mutate: updateFormField,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status
    } = trpc.form.updateFormField.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    })

    return {
        updateFormFieldAsync,
        updateFormField,
        error,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status,
        failureCount
    }
}

export const useDeleteFormField = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: deleteFormFieldAsync,
        mutate: deleteFormField,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status
    } = trpc.form.deleteFormField.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    })

    return {
        deleteFormFieldAsync,
        deleteFormField,
        error,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status,
        failureCount
    }
}

export const useGetFormField = (id: string) => {
    const {
        data: formField,
        error,
        failureCount,
        isError,
        isSuccess,
        status,
        isLoading,
        refetch
    } = trpc.form.getFormField.useQuery({ id })

    return {
        formField,
        error,
        isError,
        isSuccess,
        status,
        failureCount,
        isLoading,
        refetch
    }
}

export const useGetForm = (id: string) => {
    const {
        data: form,
        error,
        failureCount,
        isError,
        isSuccess,
        status,
        isLoading,
        refetch
    } = trpc.form.getForm.useQuery({ id })

    return {
        form,
        error,
        isError,
        isSuccess,
        status,
        failureCount,
        isLoading,
        refetch
    }
}

export const useListFormFields = (formId: string) => {
    const {
        data: fields,
        error,
        failureCount,
        isError,
        isSuccess,
        status,
        isLoading,
        refetch
    } = trpc.form.listFormFields.useQuery({ formId })

    return {
        fields,
        error,
        isError,
        isSuccess,
        status,
        failureCount,
        isLoading,
        refetch
    }
}

export const useGetFormById = (id: string) => {
    const {
        data: form,
        error,
        failureCount,
        isError,
        isSuccess,
        status,
        isLoading,
        refetch
    } = trpc.form.getFormById.useQuery({ id })

    return {
        form,
        error,
        isError,
        isSuccess,
        status,
        failureCount,
        isLoading,
        refetch
    }
}

export const usePublishForm = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: publishFormAsync,
        mutate: publishForm,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status
    } = trpc.form.publishForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    })

    return {
        publishFormAsync,
        publishForm,
        error,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status,
        failureCount
    }
}


