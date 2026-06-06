import { AUTH_ROUTES } from "@/lib/authFlow";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export type SocialProvider = "google";
export type SocialAuthIntent = "login" | "signup";

export async function signInWithSocialProvider(
  provider: SocialProvider,
  intent: SocialAuthIntent = "login"
) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase keys are missing.");
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const redirectTo = `${origin}${AUTH_ROUTES.home}`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      queryParams: { intent },
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}
