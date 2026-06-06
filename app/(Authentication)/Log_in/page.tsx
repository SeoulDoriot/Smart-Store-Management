"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AuthStudentIllustration from "@/components/auth/AuthStudentIllustration";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/authFlow";
import { toFriendlyAuthMessage } from "@/lib/authMessages";
import { loginAdmin } from "@/lib/admin-auth";
import { signInWithSocialProvider, type SocialProvider } from "@/lib/socialAuth";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

const DEMO_ACCOUNTS = [
  { label: "Customer", email: "customer@lumiere.demo", password: "lumiere123" },
  { label: "VIP Beauty", email: "vip@lumiere.demo", password: "lumiere123" },
  { label: "Admin", email: "admin@lumiere.demo", password: "admin1234" },
  { label: "Skincare Pro", email: "skincare@lumiere.demo", password: "lumiere123" },
];

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.6 10.6A2 2 0 0012 16a2 2 0 001.4-.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.9 5.1A10.3 10.3 0 0112 4c7 0 10 8 10 8a17 17 0 01-4.2 5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6.1 6.1C3.6 8.2 2 12 2 12s3 8 10 8c1.1 0 2.1-.2 3-.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return setErrorMsg("Please enter your email and password.");

    const demoAccount = DEMO_ACCOUNTS.find(
      (account) => account.email === cleanEmail && account.password === password
    );

    if (demoAccount) {
      setIsLoading(true);

      if (demoAccount.label === "Admin") {
        const result = await loginAdmin(cleanEmail, password);

        if (!result.ok) {
          setIsLoading(false);
          setErrorMsg(result.error);
          return;
        }

        router.push("/admin");
        return;
      }

      window.localStorage.setItem(
        "lumiere-demo-user",
        JSON.stringify({ email: demoAccount.email, label: demoAccount.label })
      );
      router.push(AUTH_ROUTES.home);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setErrorMsg("Use one of the demo accounts below, or add Supabase keys for real login.");

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setIsLoading(false);
        return setErrorMsg(toFriendlyAuthMessage(error.message ?? "Unable to log in."));
      }

      router.push(AUTH_ROUTES.home);
    } catch {
      setIsLoading(false);
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  async function handleSocialLogin(provider: SocialProvider) {
    setErrorMsg(null);
    setSocialLoading(provider);
    try {
      await signInWithSocialProvider(provider, "login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to continue with social sign-in.";
      setErrorMsg(toFriendlyAuthMessage(message));
      setSocialLoading(null);
    }
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-white text-zinc-900">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-8 px-6 py-24 sm:py-20 lg:grid-cols-[minmax(0,390px)_minmax(0,1fr)] lg:gap-12 lg:py-16 xl:gap-16">
        <div className="auth-form-enter relative z-20 w-full max-w-md justify-self-center lg:max-w-[390px]">
          <div className="mb-6 flex items-center justify-center">
            <h1 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">Welcome Back !!</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-center text-sm text-zinc-500">
              Log in with your email and password. No email code required.
            </p>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightIcon={showPassword ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconClick={() => setShowPassword((value) => !value)}
              rightIconLabel={showPassword ? "Hide password" : "Show password"}
            />
            {errorMsg && <p className="text-center text-xs font-medium text-red-500">{errorMsg}</p>}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#5f97ee] hover:bg-[#4f87de] active:bg-[#3f76cd]"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-[11px] text-zinc-400">Continue with :</p>
          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={() => void handleSocialLogin("google")}
              disabled={socialLoading !== null}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Continue with Google"
            >
              <Image src="/User_Image/google.png" alt="Google" width={25} height={25} />
            </button>
          </div>
          {socialLoading && <p className="mt-3 text-center text-xs text-zinc-500">Redirecting to Google...</p>}
          <p className="mt-7 text-center text-xs text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href={AUTH_ROUTES.signup} className="font-semibold text-zinc-900 underline">
              Sign Up
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
