import { apiClient } from './apiClient';

export interface MediaUploadResponse {
  id: number;
  url: string;
  file_name: string;
}

export const mediaService = {
  async uploadFile(file: File, collection: string = 'products'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collection', collection);

    try {
      const response = await apiClient.post<{ success: boolean; data: MediaUploadResponse }>('/media/upload', formData);

      const url = response.data?.data?.url;
      if (url) {
        return url;
      }
      throw new Error('Media upload API returned empty URL response.');
    } catch (error: any) {
      console.error('Media upload failed:', error);
      const msg = error?.response?.data?.message || error.message || 'Image upload failed. Please try again.';
      throw new Error(msg);
    }
  },
};
