"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAdmin } from "@/lib/admin-auth";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    const result = await loginAdmin(email, password);
    setLoading(false);

    if (result.ok) {
      router.push(redirect);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="font-serif text-3xl text-textdark">Lumiere</span>
          <span className="ml-2 rounded-full bg-textdark px-2.5 py-0.5 text-[10px] font-bold text-white">
            Admin
          </span>
        </div>

        <div className="rounded-[20px] border border-bordergray bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-offwhite">
              <Lock size={20} className="text-textgray" />
            </div>
          </div>

          <h1 className="mb-1 text-center text-lg font-semibold text-textdark">
            Admin Login
          </h1>
          <p className="mb-6 text-center text-xs text-textgray">
            Sign in to manage your store
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-textgray">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lumiere.demo"
                autoComplete="email"
                className="h-10 w-full rounded-lg border border-bordergray bg-offwhite px-3 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-textgray">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="h-10 w-full rounded-lg border border-bordergray bg-offwhite px-3 pr-10 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textgray hover:text-textdark"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M10.6 10.6A2 2 0 0012 16a2 2 0 001.4-.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9.9 5.1A10.3 10.3 0 0112 4c7 0 10 8 10 8a17 17 0 01-4.2 5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M6.1 6.1C3.6 8.2 2 12 2 12s3 8 10 8c1.1 0 2.1-.2 3-.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-center text-xs font-medium text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-xl bg-textdark text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-5 rounded-xl bg-offwhite p-3">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-textgray">
              Demo Credentials
            </p>
            <p className="text-xs text-textdark">
              <span className="font-medium">Email:</span> admin@lumiere.demo
            </p>
            <p className="text-xs text-textdark">
              <span className="font-medium">Password:</span> admin1234
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-textgray">
          Customer login is separate. This page is for store managers only.
        </p>
      </div>
    </div>
  );
}
