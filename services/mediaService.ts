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
      const response = await apiClient.post<{ success: boolean; data: MediaUploadResponse }>('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.data?.url) {
        return response.data.data.url;
      }
    } catch (error) {
      console.warn('Multipart upload API failed, falling back to data URL:', error);
    }

    // Fallback: Read file to Data URL if upload endpoint fails
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  },
};
