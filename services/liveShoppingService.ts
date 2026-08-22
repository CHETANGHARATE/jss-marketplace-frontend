import { apiClient } from './apiClient';

export interface LiveProductItem {
  id: number;
  product_id: number;
  is_pinned: boolean;
  special_live_price: number | null;
  product: {
    id: number;
    name: string;
    slug: string;
    original_price: number;
    offer_price: number;
    discount_percent: number;
    stock_quantity: number;
    primary_image?: { url: string };
    thumbnail?: string;
    brand?: { name: string };
  };
}

export interface LiveSessionItem {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  stream_url: string | null;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  scheduled_at: string;
  started_at: string | null;
  ended_at: string | null;
  viewers_count: number;
  likes_count: number;
  seller?: {
    id: number;
    name: string;
    vendor_store?: {
      store_name: string;
      logo_url?: string;
    };
  };
  products: LiveProductItem[];
}

export const liveShoppingService = {
  /**
   * Get public live sessions list (Feature 161)
   */
  async getSessions(status?: string): Promise<LiveSessionItem[]> {
    const res = await apiClient.get('/live-sessions', {
      params: { status },
    });
    return res.data.data.data || res.data.data || [];
  },

  /**
   * Get single live session detail
   */
  async getSession(idOrSlug: string | number): Promise<LiveSessionItem> {
    const res = await apiClient.get(`/live-sessions/${idOrSlug}`);
    return res.data.data;
  },

  /**
   * Join stream & increment viewer counter
   */
  async joinStream(sessionId: number): Promise<number> {
    const res = await apiClient.post(`/live-sessions/${sessionId}/join`);
    return res.data.viewers_count;
  },

  /**
   * Like / react to live stream
   */
  async sendLike(sessionId: number): Promise<number> {
    const res = await apiClient.post(`/live-sessions/${sessionId}/like`);
    return res.data.likes_count;
  },

  /**
   * Seller create new live shopping show
   */
  async createSession(payload: {
    title: string;
    description?: string;
    thumbnail?: string;
    stream_url?: string;
    scheduled_at: string;
    product_ids: number[];
    special_prices?: Record<number, number>;
  }): Promise<LiveSessionItem> {
    const res = await apiClient.post('/seller/live-sessions', payload);
    return res.data.data;
  },
};
