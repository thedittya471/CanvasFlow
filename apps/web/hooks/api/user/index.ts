import { trpc } from "~/trpc/client"

export type UserPlan = "Free" | "Pro" | "Pro+" | "Business"

/**
 * Fetches the current user's profile including their subscription plan.
 * Use this to gate Pro+/Business features on the frontend.
 */
export const useGetMe = () => {
    const { data, isLoading, error } = trpc.user.getMe.useQuery(undefined, {
        staleTime: 5 * 60 * 1000, // 5 min — plan rarely changes
        retry: false,
    })

    const plan: UserPlan = data?.plan ?? "Free"
    const hasDetailedAnalytics = plan === "Pro+" || plan === "Business"

    return {
        me: data,
        plan,
        hasDetailedAnalytics,
        isLoading,
        error,
    }
}
