'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  liveShoppingService,
  LiveSessionItem,
  LiveProductItem,
} from '@/services/liveShoppingService';
import { useCartWishlist } from '@/contexts/CartWishlistContext';
import { useToast } from '@/components/Toast';
import { Product } from '@/types';
import {
  Radio,
  Users,
  Heart,
  ShoppingBag,
  Send,
  Sparkles,
  Share2,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

export default function LiveStreamRoomPage() {
  const params = useParams();
  const router = useRouter();
  const streamId = params.id as string;

  const [session, setSession] = useState<LiveSessionItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewersCount, setViewersCount] = useState(154);
  const [likesCount, setLikesCount] = useState(892);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);

  // Live Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Video Mute Toggle
  const [isMuted, setIsMuted] = useState(true);
  const { addToCart } = useCartWishlist();
  const { cartSuccess } = useToast();

  useEffect(() => {
    loadSessionDetail();
  }, [streamId]);

  useEffect(() => {
    // Initial simulated lively chat feed
    setChatMessages([
      { id: '1', sender: 'Rohit S.', text: 'Is this eligible for COD in Pune?', time: '10:02' },
      { id: '2', sender: 'Pooja M.', text: 'Love the color! Just ordered 1 unit 😍', time: '10:03' },
      { id: '3', sender: 'Ankit V.', text: 'What is the warranty period for this?', time: '10:04' },
      { id: '4', sender: 'Host Assistant', text: 'Special live discount code applies automatically at checkout!', time: '10:05' },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadSessionDetail = async () => {
    setIsLoading(true);
    try {
      const data = await liveShoppingService.getSession(streamId);
      setSession(data);
      if (data.viewers_count) setViewersCount(data.viewers_count);
      if (data.likes_count) setLikesCount(data.likes_count);
      // Increment live viewer
      liveShoppingService.joinStream(data.id).catch(() => {});
    } catch (e) {
      console.error('Failed to load live session', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendLike = () => {
    setLikesCount((prev) => prev + 1);
    const newHeart = { id: Date.now(), left: Math.random() * 60 + 20 };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
    if (session?.id) liveShoppingService.sendLike(session.id).catch(() => {});
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'You',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const handleBuyNow = (productItem: LiveProductItem) => {
    const p = productItem.product;
    const finalPrice = productItem.special_live_price || p.offer_price || p.original_price;
    const prod: Product = {
      id: String(p.id),
      slug: p.slug,
      name: p.name,
      brand: p.brand?.name || 'JSS Live Deal',
      seller: {
        id: String(session?.seller?.id || '1'),
        name: session?.seller?.vendor_store?.store_name || session?.seller?.name || 'JSS Host',
        rating: 4.9,
        location: 'India',
        joinedDate: '',
        description: '',
      },
      category: 'Live Special',
      subcategory: '',
      originalPrice: p.original_price,
      offerPrice: Number(finalPrice),
      discountPercent: p.discount_percent,
      rating: 4.8,
      reviewsCount: 24,
      stockStatus: p.stock_quantity > 0 ? 'in_stock' : 'out_of_stock',
      image: p.primary_image?.url || p.thumbnail || '/placeholder-product.png',
      description: p.name,
      features: [],
      reviews: [],
      tags: ['live-sale'],
    };

    addToCart(prod, 1);
    cartSuccess(`Added ${p.name} at Live Discount price!`);
    router.push('/checkout');
  };

  const handleAddToCart = (productItem: LiveProductItem) => {
    const p = productItem.product;
    const finalPrice = productItem.special_live_price || p.offer_price || p.original_price;
    const prod: Product = {
      id: String(p.id),
      slug: p.slug,
      name: p.name,
      brand: p.brand?.name || 'JSS Live Deal',
      seller: {
        id: String(session?.seller?.id || '1'),
        name: session?.seller?.vendor_store?.store_name || session?.seller?.name || 'JSS Host',
        rating: 4.9,
        location: 'India',
        joinedDate: '',
        description: '',
      },
      category: 'Live Special',
      subcategory: '',
      originalPrice: p.original_price,
      offerPrice: Number(finalPrice),
      discountPercent: p.discount_percent,
      rating: 4.8,
      reviewsCount: 24,
      stockStatus: p.stock_quantity > 0 ? 'in_stock' : 'out_of_stock',
      image: p.primary_image?.url || p.thumbnail || '/placeholder-product.png',
      description: p.name,
      features: [],
      reviews: [],
      tags: ['live-sale'],
    };

    addToCart(prod, 1);
    cartSuccess(`Added ${p.name} to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xs">
        Connecting to live stream broadcast...
      </div>
    );
  }

  const pinnedProduct = session?.products?.[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Top Floating Navigation Bar */}
      <div className="p-4 flex items-center justify-between z-30 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <Link
            href="/live"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md"
          >
            <ChevronLeft size={20} />
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-600 text-white text-[10px] font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <Radio size={12} className="animate-pulse" />
              <span>LIVE STREAM</span>
            </span>

            <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-xl text-[10px] font-bold flex items-center gap-1.5 border border-white/10">
              <Users size={12} className="text-emerald-400" />
              <span>{viewersCount.toLocaleString()} watching</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md"
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Main Streaming Theater Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left 2 Cols: Live Video Stage */}
        <div className="lg:col-span-2 relative aspect-[16/9] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl flex items-center justify-center group">
          {session?.stream_url ? (
            <video
              src={session.stream_url}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full relative flex items-center justify-center bg-radial from-slate-900 to-black">
              <img
                src={session?.thumbnail || '/placeholder-product.png'}
                alt={session?.title || 'Live Show'}
                className="w-full h-full object-cover opacity-40 blur-xs"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-600/80 flex items-center justify-center text-white shadow-2xl animate-pulse">
                  <Radio size={32} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white max-w-md">
                  {session?.title || 'JSS Special Live Shopping Broadcast'}
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Host: {session?.seller?.vendor_store?.store_name || session?.seller?.name || 'JSS Verified Creator'}
                </p>
              </div>
            </div>
          )}

          {/* Floating Hearts Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingHearts.map((h) => (
              <div
                key={h.id}
                className="absolute bottom-12 text-rose-500 animate-fade-in"
                style={{
                  left: `${h.left}%`,
                  animation: 'floatUp 1.5s forwards ease-out',
                }}
              >
                <Heart size={28} className="fill-current drop-shadow-lg" />
              </div>
            ))}
          </div>

          {/* Bottom Video Overlay: Title & Like Trigger */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 max-w-sm">
              <h3 className="font-bold text-xs truncate">{session?.title}</h3>
              <span className="text-[10px] text-slate-300">
                Exclusive stream price discounts applied
              </span>
            </div>

            <button
              onClick={handleSendLike}
              className="p-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-all shadow-2xl hover:scale-110 active:scale-95 flex items-center gap-1.5 font-black text-xs cursor-pointer"
            >
              <Heart size={18} className="fill-current" />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>

        {/* Right Col: Live Chat & Pinned Showcase Product */}
        <div className="h-[480px] lg:h-[540px] bg-slate-900/90 border border-white/10 rounded-3xl p-4 flex flex-col justify-between backdrop-blur-xl shadow-2xl">
          {/* Top: Pinned Live Deal Card */}
          {pinnedProduct && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 mb-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>Featured Live Deal</span>
                </span>
                <span className="text-[9px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                  Limited Live Stock
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={pinnedProduct.product.primary_image?.url || pinnedProduct.product.thumbnail || '/placeholder-product.png'}
                  alt={pinnedProduct.product.name}
                  className="w-14 h-14 object-cover rounded-xl bg-black border border-white/10 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-0.5">
                  <h4 className="font-bold text-xs truncate text-white">
                    {pinnedProduct.product.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-sm text-emerald-400">
                      ₹{(pinnedProduct.special_live_price || pinnedProduct.product.offer_price || pinnedProduct.product.original_price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{pinnedProduct.product.original_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleAddToCart(pinnedProduct)}
                  className="py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleBuyNow(pinnedProduct)}
                  className="py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}

          {/* Middle: Live Comments Stream Feed */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs no-scrollbar">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="p-2 rounded-xl bg-white/5 space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-slate-200">{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="text-slate-100 font-medium">{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Bottom: Send Chat Bar */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-3 border-t border-white/10">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question or comment..."
              className="flex-1 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-2xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl transition-all shadow-md"
              title="Send Comment"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-160px) scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
