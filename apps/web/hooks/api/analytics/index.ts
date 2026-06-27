import { trpc } from "~/trpc/client"

/**
 * Fetches all free-tier analytics metrics for a single form.
 * Returns: totalResponses, totalViews, completionRate, deviceViews,
 *          dailyTrends (30d), hourlyDistribution, peakHour, peakDay,
 *          avgSubmissionsPerDay, avgSubmissionsPerWeek.
 */
export const useGetFormAnalytics = (formId: string) => {
    const {
        data: analytics,
        error,
        isLoading,
        isError,
        isSuccess,
        refetch,
    } = trpc.analytics.getFormAnalytics.useQuery(
        { formId },
        { enabled: !!formId && formId.length === 36 }
    )

    return { analytics, error, isLoading, isError, isSuccess, refetch }
}

/**
 * Fetches the full submission rows for a form (includes values jsonb).
 * Kept separate so the heavy payload is only loaded when the table is open.
 * Polls every 30s only when the page is visible.
 */
export const useGetSubmissions = (formId: string) => {
    const {
        data,
        error,
        isLoading,
        isError,
        isSuccess,
        refetch,
    } = trpc.analytics.getSubmissions.useQuery(
        { formId },
        {
            enabled: !!formId && formId.length === 36,
            // Only poll when the tab is visible — avoids background churn
            refetchInterval: (query) =>
                typeof document !== "undefined" && document.visibilityState === "visible" && query.state.data
                    ? 30_000
                    : false,
        }
    )

    return {
        submissions: data?.submissions ?? [],
        error,
        isLoading,
        isError,
        isSuccess,
        refetch,
    }
}

/**
 * Records that a visitor answered a field and clicked Next.
 * Called on each Next click in the public form page.
 */
export const useRecordFieldAnswer = () => {
    const {
        mutate: recordFieldAnswer,
        mutateAsync: recordFieldAnswerAsync,
        isPending,
    } = trpc.analytics.recordFieldAnswer.useMutation()

    return { recordFieldAnswer, recordFieldAnswerAsync, isPending }
}

/**
 * Records a view for a public form page.
 */
export const useRecordView = () => {
    const {
        mutateAsync: recordViewAsync,
        mutate: recordView,
        error,
        isPending,
        isSuccess,
    } = trpc.analytics.recordView.useMutation()

    return { recordViewAsync, recordView, error, isPending, isSuccess }
}

/**
 * Pro-tier: per-question distribution, day-of-week breakdown,
 * 30/60/90d trend totals, response velocity.
 * Only call this when you've already confirmed the user has Pro+/Business plan
 * via useGetMe — the server will still enforce it, but the client gates first.
 */
export const useGetProAnalytics = (formId: string) => {
    const {
        data: proAnalytics,
        error,
        isLoading,
        isError,
        refetch,
    } = trpc.analytics.getProAnalytics.useQuery(
        { formId },
        { enabled: !!formId && formId.length === 36, retry: false }
    )

    return { proAnalytics, error, isLoading, isError, refetch }
}

/**
 * Returns the current user's plan from the session (via the form list endpoint
 * which already fetches forms per-user). We derive plan from the auth session
 * on the server; here we just check if the Pro analytics query returns FORBIDDEN.
 */
export const useUserPlan = () => {
    const { data } = trpc.form.listFormsByUserId.useQuery()
    // plan is not directly exposed — use isForbidden from useGetProAnalytics instead
    // This hook is a placeholder for when plan is exposed on the context.
    return { hasPro: false, hasData: !!data }
}
