'use client';

import React, { useState } from 'react';
import { useAdminReviewsQuery, useModerateReviewMutation } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { ApiReview } from '../../../types/api';
import { MessageSquare, Star, Check, X, Filter } from 'lucide-react';

type FilterType = 'All' | 'Pending' | 'Approved' | 'Rejected';

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  
  const { data, isLoading, isError } = useAdminReviewsQuery();
  const moderateMutation = useModerateReviewMutation();

  const reviews = data?.data || [];
  
  const filteredReviews = reviews.filter((review: ApiReview) => {
    if (filter === 'All') return true;
    return review.status?.toLowerCase() === filter.toLowerCase();
  });

  const handleModerate = async (reviewId: string | number, action: 'approve' | 'reject') => {
    try {
      const status = action === 'approve' ? 'approved' as const : 'rejected' as const;
      await moderateMutation.mutateAsync({ id: Number(reviewId), status });
    } catch (error) {
      console.error(`Failed to ${action} review`, error);
    }
  };

  const getStatusBadge = (status: string = 'pending') => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full dark:bg-red-900/30 dark:text-red-400">Rejected</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">Pending</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-8 lg:p-12 md:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          <Breadcrumbs 
            items={[
              { label: 'Admin', href: '/admin' },
              { label: 'Reviews', href: '/admin/reviews' }
            ]} 
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-rose-500" />
                Customer Reviews
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage and moderate product reviews across the marketplace.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-5 h-5 text-muted-foreground mr-2" />
              {['All', 'Pending', 'Approved', 'Rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as FilterType)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === f 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-muted/50 rounded-2xl h-32 w-full"></div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load reviews. Please try again.</p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No reviews found</h3>
                <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
                  There are no reviews matching the "{filter}" filter.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredReviews.map((review: ApiReview) => {
                  const status = review.status?.toLowerCase() || 'pending';
                  return (
                    <div key={review.id} className="border border-border/40 rounded-2xl p-5 flex flex-col justify-between hover:border-rose-500/30 transition-colors">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {review.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Product: {'Product #' + review.product_id}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(status)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'}`} 
                            />
                          ))}
                        </div>
                        
                        <p className="text-sm text-foreground line-clamp-3 mb-4">
                          "{review.comment}"
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at || Date.now()).toLocaleDateString()}
                        </span>
                        
                        <div className="flex gap-2">
                          {(status === 'pending' || status === 'rejected') && (
                            <button
                              onClick={() => handleModerate(review.id, 'approve')}
                              disabled={moderateMutation.isPending}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors dark:bg-green-900/20 dark:hover:bg-green-900/40"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}
                          {(status === 'pending' || status === 'approved') && (
                            <button
                              onClick={() => handleModerate(review.id, 'reject')}
                              disabled={moderateMutation.isPending}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors dark:bg-red-900/20 dark:hover:bg-red-900/40"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
