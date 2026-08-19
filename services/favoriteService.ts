import { apiClient } from './apiClient';
import { ApiResponse } from '../types/api';

export interface FavoriteBrandItem {
  id: number;
  favorite_id: number;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  products_count: number;
  favorited_at: string;
}

export interface FavoriteCategoryItem {
  id: number;
  favorite_id: number;
  name: string;
  slug: string;
  image?: string | null;
  icon?: string | null;
  description?: string | null;
  products_count: number;
  favorited_at: string;
}

export interface FollowedStoreItem {
  id: number;
  store_name: string;
  slug: string;
  logo?: string | null;
  banner?: string | null;
  rating: number;
  followers_count: number;
  followed_at: string;
}

export const favoriteService = {
  // Feature 66: Favorite Brands
  async getFavoriteBrands(): Promise<FavoriteBrandItem[]> {
    const response = await apiClient.get<ApiResponse<FavoriteBrandItem[]>>('/favorites/brands');
    return response.data.data || [];
  },

  async addFavoriteBrand(brandId: number): Promise<{ id: number; is_favorite: boolean }> {
    const response = await apiClient.post<ApiResponse<{ id: number; is_favorite: boolean }>>(`/favorites/brands/${brandId}`);
    return response.data.data;
  },

  async removeFavoriteBrand(brandId: number): Promise<{ id: number; is_favorite: boolean }> {
    const response = await apiClient.delete<ApiResponse<{ id: number; is_favorite: boolean }>>(`/favorites/brands/${brandId}`);
    return response.data.data;
  },

  // Feature 67: Favorite Categories
  async getFavoriteCategories(): Promise<FavoriteCategoryItem[]> {
    const response = await apiClient.get<ApiResponse<FavoriteCategoryItem[]>>('/favorites/categories');
    return response.data.data || [];
  },

  async addFavoriteCategory(categoryId: number): Promise<{ id: number; is_favorite: boolean }> {
    const response = await apiClient.post<ApiResponse<{ id: number; is_favorite: boolean }>>(`/favorites/categories/${categoryId}`);
    return response.data.data;
  },

  async removeFavoriteCategory(categoryId: number): Promise<{ id: number; is_favorite: boolean }> {
    const response = await apiClient.delete<ApiResponse<{ id: number; is_favorite: boolean }>>(`/favorites/categories/${categoryId}`);
    return response.data.data;
  },

  // Feature 65: Follow Seller / Store
  async getFollowedStores(): Promise<FollowedStoreItem[]> {
    const response = await apiClient.get<ApiResponse<FollowedStoreItem[]>>('/stores/following');
    return response.data.data || [];
  },

  async followStore(storeId: number): Promise<{ store_id: number; is_following: boolean; followers_count: number }> {
    const response = await apiClient.post<ApiResponse<{ store_id: number; is_following: boolean; followers_count: number }>>(`/stores/${storeId}/follow`);
    return response.data.data;
  },

  async unfollowStore(storeId: number): Promise<{ store_id: number; is_following: boolean; followers_count: number }> {
    const response = await apiClient.delete<ApiResponse<{ store_id: number; is_following: boolean; followers_count: number }>>(`/stores/${storeId}/unfollow`);
    return response.data.data;
  },
};
