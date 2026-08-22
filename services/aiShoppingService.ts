import { apiClient } from './apiClient';

export interface AiRecommendedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  original_price: number;
  discount_percent: number;
  rating: number;
  reviews_count: number;
  image: string;
  brand: string;
  seller_name: string;
  is_wholesale: boolean;
  wholesale_moq: number;
  in_stock: boolean;
}

export interface AiChatResponse {
  session_id: string;
  reply: string;
  intent: {
    keywords: string[];
    max_budget: number | null;
    min_budget: number | null;
    target_audience: string | null;
    is_bulk: boolean;
    bulk_quantity: number | null;
  };
  products: AiRecommendedProduct[];
  suggestions: string[];
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  products?: AiRecommendedProduct[];
  suggestions?: string[];
  timestamp: string;
}

export const aiShoppingService = {
  /**
   * Send user message to AI shopping assistant
   */
  async sendMessage(message: string, sessionId?: string): Promise<AiChatResponse> {
    const res = await apiClient.post('/ai/chat', {
      message,
      session_id: sessionId,
    });
    return res.data.data;
  },

  /**
   * Retrieve chat history
   */
  async getHistory(sessionId?: string): Promise<any[]> {
    const res = await apiClient.get('/ai/history', {
      params: { session_id: sessionId },
    });
    return res.data.data || [];
  },

  /**
   * Clear chat history
   */
  async clearHistory(sessionId?: string): Promise<void> {
    await apiClient.delete('/ai/history', {
      params: { session_id: sessionId },
    });
  },
};
