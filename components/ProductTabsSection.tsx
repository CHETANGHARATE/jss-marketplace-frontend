'use client';

import React, { useState } from 'react';
import { ApiProduct } from '../types/api';
import { useToast } from './Toast';
import {
  FileText,
  List,
  Info,
  Truck,
  Star,
  MessageSquarePlus,
  CheckCircle2,
  ThumbsUp,
  X,
  UserCheck
} from 'lucide-react';

interface ProductTabsSectionProps {
  product: ApiProduct;
}

interface UserReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export function ProductTabsSection({ product }: ProductTabsSectionProps) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'info' | 'shipping' | 'reviews'>('description');

  // Review Form Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newComment, setNewComment] = useState('');

  // Local state for user reviews
  const initialReviews: UserReview[] = [
    {
      id: 'rev-1',
      userName: 'Aarav Sharma',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Exceptional product quality! Original authentic product packaged with high care. Highly recommended marketplace seller.',
      verified: true,
    },
    {
      id: 'rev-2',
      userName: 'Priya Patel',
      rating: 5,
      date: '1 month ago',
      comment: 'Super fast delivery in 3 days to Mumbai. Exactly as described. Will definitely order again.',
      verified: true,
    },
    {
      id: 'rev-3',
      userName: 'Vikram Joshi',
      rating: 4,
      date: '1 month ago',
      comment: 'Good value for money. Minor delay in dispatch by 1 day but product condition was perfect.',
      verified: true,
    },
  ];

  const [reviewsList, setReviewsList] = useState<UserReview[]>(initialReviews);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newComment.trim()) {
      toastError('Please fill in both your name and review comment.', 'Missing Fields');
      return;
    }

    const review: UserReview = {
      id: `rev-${Date.now()}`,
      userName: newReviewerName.trim(),
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      verified: true,
    };

    setReviewsList([review, ...reviewsList]);
    setNewReviewerName('');
    setNewComment('');
    setNewRating(5);
    setIsReviewModalOpen(false);

    toastSuccess('Thank you! Your review has been submitted successfully.');
  };

  const specsList = product.specifications && product.specifications.length > 0
    ? product.specifications
    : [
        { spec_key: 'Brand', spec_value: product.brand?.name || 'Verified Brand' },
        { spec_key: 'Category', spec_value: typeof product.category?.name === 'string' ? product.category.name : 'Marketplace Catalog' },
        { spec_key: 'SKU', spec_value: product.sku || `JSS-PROD-${product.id}` },
        { spec_key: 'Country of Origin', spec_value: 'India' },
        { spec_key: 'Warranty', spec_value: '1 Year Manufacturer Guarantee' },
        { spec_key: 'Shelf Life / Guarantee', spec_value: 'Best Quality Sealed Product' },
      ];

  return (
    <div id="reviews-section" className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border-custom/80 no-scrollbar">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'description'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-custom hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <FileText size={15} />
          <span>Description</span>
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'specs'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-custom hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <List size={15} />
          <span>Specifications</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'info'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-custom hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <Info size={15} />
          <span>Additional Information</span>
        </button>

        <button
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'shipping'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-custom hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <Truck size={15} />
          <span>Shipping & Returns</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-custom hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <Star size={15} />
          <span>Reviews ({reviewsList.length})</span>
        </button>
      </div>

      {/* Tab 1: Description */}
      {activeTab === 'description' && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-xl font-black text-foreground">Detailed Product Overview</h3>
          <p className="text-sm text-foreground/80 leading-relaxed font-normal">
            {product.description ||
              `Discover the premium quality of ${product.name}. Carefully sourced and verified for optimal standards, offering durability, high performance, and exceptional value for your everyday needs.`}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border-custom/80">
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Key Highlights & Features</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80 font-medium bg-background-secondary/60 p-3 rounded-xl border border-border-custom/60">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Specifications */}
      {activeTab === 'specs' && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-xl font-black text-foreground">Technical Specifications</h3>
          <div className="border border-border-custom/80 rounded-2xl overflow-hidden divide-y divide-border-custom/60">
            {specsList.map((spec: any, idx: number) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs font-medium bg-card odd:bg-background-secondary/40">
                <span className="font-bold text-foreground">{spec.spec_key || spec.key}</span>
                <span className="sm:col-span-2 text-muted-custom font-semibold">{spec.spec_value || spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Additional Information */}
      {activeTab === 'info' && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-xl font-black text-foreground">Additional Vendor & Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-background-secondary/60 border border-border-custom/80 rounded-2xl space-y-2">
              <span className="font-extrabold text-foreground uppercase tracking-wider text-[10px] block">Marketplace Vendor</span>
              <p className="font-black text-foreground text-sm">{product.seller?.name || 'Verified Marketplace Vendor'}</p>
              <p className="text-muted-custom">Compliance & Quality Control Verified by JSS Solutions.</p>
            </div>
            <div className="p-4 bg-background-secondary/60 border border-border-custom/80 rounded-2xl space-y-2">
              <span className="font-extrabold text-foreground uppercase tracking-wider text-[10px] block">Warranty & Guarantee</span>
              <p className="font-black text-foreground text-sm">1 Year Official Manufacturer Warranty</p>
              <p className="text-muted-custom">Covers manufacturing defects and authentic product guarantees.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Shipping & Returns */}
      {activeTab === 'shipping' && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-xl font-black text-foreground">Shipping, Delivery & Return Policy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 bg-background-secondary/60 border border-border-custom/80 rounded-2xl space-y-2">
              <Truck size={20} className="text-primary" />
              <h4 className="font-bold text-foreground text-sm">Express Shipping</h4>
              <p className="text-muted-custom leading-relaxed">
                Dispatched within 24 hours. Estimated delivery in 3 to 5 business days across India.
              </p>
            </div>
            <div className="p-5 bg-background-secondary/60 border border-border-custom/80 rounded-2xl space-y-2">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <h4 className="font-bold text-foreground text-sm">10-Day Return Guarantee</h4>
              <p className="text-muted-custom leading-relaxed">
                Hassle-free 10-day replacement or full refund if damaged, defective, or incorrect item received.
              </p>
            </div>
            <div className="p-5 bg-background-secondary/60 border border-border-custom/80 rounded-2xl space-y-2">
              <UserCheck size={20} className="text-indigo-500" />
              <h4 className="font-bold text-foreground text-sm">Cash on Delivery</h4>
              <p className="text-muted-custom leading-relaxed">
                COD available on eligible PIN codes. Pay securely at your doorstep upon physical receipt.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5 / Section 8: Reviews Section */}
      {activeTab === 'reviews' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border-custom/80">
            {/* Rating Summary Card */}
            <div className="flex items-center gap-6">
              <div className="text-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-3xl min-w-[110px]">
                <span className="text-4xl font-black text-amber-500 block leading-none">
                  {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                </span>
                <div className="flex text-amber-500 justify-center my-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-muted-custom uppercase">
                  {reviewsList.length} Ratings
                </span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-1.5 flex-1 min-w-[180px]">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct = stars === 5 ? 85 : stars === 4 ? 10 : stars === 3 ? 3 : 1;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-[11px] font-semibold text-muted-custom">
                      <span className="w-4">{stars}★</span>
                      <div className="flex-1 h-2 bg-background-secondary rounded-full overflow-hidden border border-border-custom/60">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right font-bold text-foreground">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-black rounded-2xl shadow-xs transition-all active:scale-95 shrink-0"
            >
              <MessageSquarePlus size={16} />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Customer Reviews List */}
          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-5 bg-background-secondary/50 border border-border-custom/80 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center border border-primary/20">
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span>{rev.userName}</span>
                        {rev.verified && (
                          <span className="text-[10px] text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
                            Verified Buyer
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-muted-custom font-medium">{rev.date}</p>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < rev.rating ? 'currentColor' : 'none'}
                        className={i < rev.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-foreground/80 leading-relaxed font-normal">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-3xl border border-border-custom max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted-custom hover:text-foreground rounded-full hover:bg-background-secondary transition-colors"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-lg font-black text-foreground">Write a Verified Review</h3>
              <p className="text-xs text-muted-custom mt-1">Share your thoughts on {product.name}</p>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star size={24} fill={star <= newRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-background-secondary border border-border-custom/80 px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Your Review</label>
                <textarea
                  required
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell us what you liked about this product..."
                  className="w-full bg-background-secondary border border-border-custom/80 px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary font-medium resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border border-border-custom hover:bg-background-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-primary hover:bg-primary-hover text-white transition-colors shadow-2xs"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
