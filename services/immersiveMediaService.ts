import { apiClient } from './apiClient';

export interface Product360AndArData {
  product_id: number;
  has_360: boolean;
  frames_count: number;
  frames: string[];
  is_ar_enabled: boolean;
  ar_model_glb: string | null;
  ar_model_usdz: string | null;
  is_try_on_enabled: boolean;
  try_on_category: string | null;
}

export interface TryOnEligibility {
  product_id: number;
  is_eligible: boolean;
  try_on_category: string | null;
}

export interface TryOnResult {
  success: boolean;
  session_id?: string;
  product?: {
    id: number;
    name: string;
    category: string;
    overlay_image: string;
  };
  status?: string;
  message?: string;
}

export const immersiveMediaService = {
  /**
   * Fetch 360° frames sequence & AR 3D model URLs for product
   */
  async get360AndAr(productId: number | string): Promise<Product360AndArData> {
    const res = await apiClient.get(`/products/${productId}/media-360-ar`);
    return res.data.data;
  },

  /**
   * Check if product is eligible for Virtual Try-On
   */
  async checkTryOnEligibility(productId: number | string): Promise<TryOnEligibility> {
    const res = await apiClient.get(`/try-on/eligibility/${productId}`);
    return res.data.data;
  },

  /**
   * Generate Virtual Try-On preview
   */
  async generateTryOn(input: {
    productId: number | string;
    photoFile?: File;
    photoData?: string;
    consentAgreed: boolean;
  }): Promise<TryOnResult> {
    if (input.photoFile) {
      const formData = new FormData();
      formData.append('product_id', String(input.productId));
      formData.append('photo', input.photoFile);
      formData.append('consent_agreed', input.consentAgreed ? '1' : '0');

      const res = await apiClient.post('/try-on/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } else if (input.photoData) {
      const res = await apiClient.post('/try-on/generate', {
        product_id: input.productId,
        photo_data: input.photoData,
        consent_agreed: input.consentAgreed,
      });
      return res.data;
    }

    throw new Error('Either photoFile or photoData is required');
  },
};
