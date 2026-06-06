export const AUTH_ROUTES = {
  welcome: "/Welcome_Page",
  login: "/Log_in",
  signup: "/Sign_up",
  otpVerify: "/otp-verify",
  home: "/",
} as const;

type PendingSignup = {
  email: string;
  fullName: string;
  role: "user" | "admin";
};

const PENDING_SIGNUP_KEY = "website_pending_signup";

export function storePendingSignup(value: PendingSignup) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(value));
}

export function readPendingSignup(): PendingSignup | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(PENDING_SIGNUP_KEY);
    return raw ? (JSON.parse(raw) as PendingSignup) : null;
  } catch {
    return null;
  }
}

export function clearPendingSignup() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PENDING_SIGNUP_KEY);
}
