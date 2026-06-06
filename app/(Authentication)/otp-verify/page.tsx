"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AuthStudentIllustration from "@/components/auth/AuthStudentIllustration";
import Button from "@/components/ui/Button";
import { AUTH_ROUTES, clearPendingSignup, readPendingSignup } from "@/lib/authFlow";
import { toFriendlyAuthMessage } from "@/lib/authMessages";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

function OtpVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? readPendingSignup()?.email ?? "";
  const type = searchParams.get("type") === "login" ? "login" : "signup";
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function verifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (!email.trim()) return setMessage("Email is missing. Please go back and try again.");
    if (!code.trim()) return setMessage("Please enter the verification code.");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setMessage("Supabase keys are missing.");

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: type === "login" ? "email" : "signup",
    });
    setLoading(false);

    if (error) {
      return setMessage(toFriendlyAuthMessage(error.message));
    }

    clearPendingSignup();
    router.push("/");
  }

  async function resendCode() {
    setMessage(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setMessage("Supabase keys are missing.");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: type === "signup" },
    });

    setMessage(error ? toFriendlyAuthMessage(error.message) : "A new code has been sent.");
  }

  return (
    <div className="flex min-h-screen items-center bg-white text-zinc-900">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:gap-16 xl:gap-24">
        <div className="auth-form-enter relative z-20 w-full max-w-md lg:flex lg:min-h-[580px] lg:flex-col lg:justify-start lg:pt-12">
          <h1 className="mb-4 text-center text-4xl font-bold text-zinc-900">Verify email</h1>
          <p className="mb-8 text-center text-sm leading-6 text-zinc-500">
            We sent a verification code to <span className="font-semibold text-zinc-900">{email || "your email"}</span>.
          </p>

          <form onSubmit={verifyCode} className="space-y-4">
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="h-14 w-full rounded-full border border-zinc-200 bg-white px-6 text-center text-lg font-semibold tracking-[0.2em] text-zinc-900 outline-none transition focus:border-[#5f97ee] focus:ring-4 focus:ring-[#5f97ee]/15"
            />
            {message && <p className="text-center text-sm text-zinc-500">{message}</p>}
            <Button type="submit" disabled={loading} className="bg-[#5f97ee] hover:bg-[#4f87de] active:bg-[#3f76cd]">
              {loading ? "Verifying..." : "Verify account"}
            </Button>
          </form>

          <button type="button" onClick={() => void resendCode()} className="mt-5 text-center text-sm font-semibold text-zinc-900 underline">
            Resend code
          </button>

          <p className="mt-7 text-center text-xs text-zinc-500">
            Need a different email?{" "}
            <Link href={type === "login" ? AUTH_ROUTES.login : AUTH_ROUTES.signup} className="font-semibold text-zinc-900 underline">
              Go back
            </Link>
          </p>
        </div>
        <div className="auth-visual-enter">
          <AuthStudentIllustration imageSrc="/User_Image/Display.png" alt="Library display" />
        </div>
      </div>
    </div>
  );
}

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={null}>
      <OtpVerifyContent />
    </Suspense>
  );
}
