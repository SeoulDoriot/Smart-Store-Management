import { supabase } from "./supabase";
import type { Product } from "@/types/product";
import type { AIConversation, AIRecommendation } from "@/types/ai";

// ── AI Advisor service ───────────────────────────────────────────────────────
// The AI API key (OPENROUTER_API_KEY) must NEVER be exposed in frontend code.
// Real inference calls should go through a server action or API route.

export interface AIAdvisorInput {
  question: string;
  skinType?: string;
  skinConcern?: string;
  budget?: string;
  customerId?: string;
  sessionId?: string;
}

export interface AIAdvisorResult {
  answer: string;
  products: Product[];
  conversationId?: string;
}

export async function askAIAdvisor(
  input: AIAdvisorInput
): Promise<AIAdvisorResult> {
  // Log conversation to Supabase if available
  if (supabase) {
    await supabase.from("ai_conversations").insert({
      customer_id: input.customerId ?? null,
      session_id: input.sessionId ?? null,
      question: input.question,
      skin_type: input.skinType ?? null,
      skin_concern: input.skinConcern ?? null,
      budget: input.budget ?? null,
    });
  }

  // Placeholder — real AI inference not connected yet
  return {
    answer: "AI advisor is not connected yet. This is a placeholder response.",
    products: [],
  };
}

// ── Read conversation history ────────────────────────────────────────────────

export async function getConversations(
  limit = 50
): Promise<AIConversation[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("ai_conversations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (!error && data) return data as AIConversation[];
  }
  return [];
}

export async function getRecommendations(
  conversationId: string
): Promise<AIRecommendation[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("ai_recommendations")
      .select("*")
      .eq("conversation_id", conversationId);
    if (!error && data) return data as AIRecommendation[];
  }
  return [];
}
