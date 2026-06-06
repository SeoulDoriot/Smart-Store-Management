export function toFriendlyAuthMessage(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (lower.includes("already registered") || lower.includes("already exists")) {
    return "This email is already registered.";
  }

  if (lower.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (lower.includes("email not confirmed")) {
    return "Please verify your email before continuing.";
  }

  if (lower.includes("missing") && lower.includes("supabase")) {
    return "Supabase is not configured yet. Add your public URL and anon key.";
  }

  return message || "Something went wrong. Please try again.";
}
