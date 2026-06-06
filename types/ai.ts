export interface AIConversation {
  id: string;
  customer_id?: string;
  order_id?: string;
  question: string;
  language?: "en" | "km";
  skin_type?: string;
  skin_concern?: string;
  budget?: string;
  created_at?: string;
}

export interface AIRecommendation {
  id: string;
  conversation_id: string;
  recommended_product_ids: string[];
  reason?: string;
  converted_to_order: boolean;
  created_at?: string;
}
