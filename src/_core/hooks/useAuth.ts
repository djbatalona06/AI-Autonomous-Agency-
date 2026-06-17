import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export function useAuth() {
  const utils = trpc.useUtils();
  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      window.location.href = "/";
    },
  });

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    loginUrl: getLoginUrl(),
    logout: () => logoutMutation.mutate(),
  };
}
