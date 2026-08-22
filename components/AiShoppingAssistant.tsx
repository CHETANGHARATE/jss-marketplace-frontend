'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  aiShoppingService,
  AiMessage,
  AiRecommendedProduct,
} from '@/services/aiShoppingService';
import { useCartWishlist } from '@/contexts/CartWishlistContext';
import { useToast } from '@/components/Toast';
import { Product } from '@/types';
import {
  Sparkles,
  Bot,
  User as UserIcon,
  Send,
  X,
  RefreshCw,
  ShoppingBag,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Minimize2,
  Trash2,
} from 'lucide-react';

export function AiShoppingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const { addToCart } = useCartWishlist();
  const { cartSuccess } = useToast();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate or load session ID
    let sid = localStorage.getItem('jss_ai_session_id');
    if (!sid) {
      sid = 'ai_sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('jss_ai_session_id', sid);
    }
    setSessionId(sid);

    // Initial greeting if empty
    setMessages([
      {
        id: 'greet_1',
        sender: 'assistant',
        text: "Hello! I'm your JSS AI Shopping Assistant. Tell me what you're looking for, your budget, or any specific requirements (e.g., 'Find cotton kurtis under ₹1500' or '20 units of office chairs for my office') and I'll find the best options from our catalog!",
        suggestions: [
          'Gift ideas under ₹2,000',
          'Cotton kurtis under ₹1,500',
          'Wholesale bulk products',
          'Wireless headphones with mic',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    const userMsg: AiMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await aiShoppingService.sendMessage(text, sessionId);

      if (res.session_id && res.session_id !== sessionId) {
        setSessionId(res.session_id);
        localStorage.setItem('jss_ai_session_id', res.session_id);
      }

      const assistantMsg: AiMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'assistant',
        text: res.reply,
        products: res.products,
        suggestions: res.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const errorMsg: AiMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'assistant',
        text: "I'm having a brief connection issue. Please try rephrasing your search or checking our search bar.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = async () => {
    try {
      await aiShoppingService.clearHistory(sessionId);
      const newSid = 'ai_sess_' + Math.random().toString(36).substring(2, 15);
      setSessionId(newSid);
      localStorage.setItem('jss_ai_session_id', newSid);
      setMessages([
        {
          id: 'greet_restart',
          sender: 'assistant',
          text: "Chat cleared. What can I help you find today on JSS Solutions Marketplace?",
          suggestions: [
            'Gift ideas under ₹2,000',
            'Best rated electronics',
            'B2B Wholesale deals',
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {}
  };

  const handleAddToCart = (product: AiRecommendedProduct) => {
    const prod: Product = {
      id: String(product.id),
      slug: product.slug,
      name: product.name,
      brand: product.brand || 'JSS Certified',
      seller: {
        id: '1',
        name: product.seller_name || 'JSS Partner',
        rating: 4.8,
        location: 'India',
        joinedDate: '',
        description: '',
      },
      category: 'General',
      subcategory: '',
      originalPrice: product.original_price,
      offerPrice: product.price,
      discountPercent: product.discount_percent,
      rating: product.rating,
      reviewsCount: product.reviews_count,
      stockStatus: product.in_stock ? 'in_stock' : 'out_of_stock',
      image: product.image,
      description: product.name,
      features: [],
      reviews: [],
      tags: [],
    };
    addToCart(prod, 1);
    cartSuccess(`Added ${product.name} to cart!`);
  };

  return (
    <>
      {/* 1. Global Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 hover:from-primary-hover text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group cursor-pointer border-2 border-white/20"
          aria-label="Open AI Shopping Assistant"
        >
          <div className="relative">
            <Bot size={22} className="animate-bounce" />
            <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-300 animate-spin" />
          </div>
          <span className="hidden sm:inline font-black text-xs uppercase tracking-wider">
            AI Assistant
          </span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
          </span>
        </button>
      )}

      {/* 2. Slide-out AI Assistant Drawer Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[440px] max-h-[85vh] h-[650px] bg-card border border-border-custom/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in backdrop-blur-xl">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs border border-white/30">
                <Bot size={20} className="text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm">JSS Shopping AI</h3>
                  <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-200 border border-amber-300/30 text-[9px] font-black rounded-md uppercase tracking-wider">
                    Live Catalog
                  </span>
                </div>
                <span className="text-[10px] text-white/80 font-medium flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-300" /> Real products & verified prices
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Clear Chat History"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Close Assistant"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white font-bold rounded-tr-xs'
                      : 'bg-card border border-border-custom/80 text-foreground font-medium rounded-tl-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Real Product Cards Container */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-border-custom/60">
                      <span className="text-[10px] font-black uppercase text-primary tracking-wider block">
                        Matching Verified Products ({msg.products.length}):
                      </span>

                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                        {msg.products.map((p) => (
                          <div
                            key={p.id}
                            className="p-2.5 bg-background rounded-xl border border-border-custom/80 flex gap-2.5 items-center hover:border-primary/50 transition-colors shadow-2xs"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-14 h-14 object-cover rounded-lg bg-card shrink-0 border border-border-custom/60"
                            />

                            <div className="flex-1 min-w-0 space-y-0.5">
                              <Link
                                href={`/product/${p.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="font-bold text-foreground hover:text-primary transition-colors block truncate text-[11px]"
                              >
                                {p.name}
                              </Link>

                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-foreground text-xs">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </span>
                                {p.original_price > p.price && (
                                  <span className="text-[10px] text-muted-custom line-through">
                                    ₹{p.original_price.toLocaleString('en-IN')}
                                  </span>
                                )}
                                {p.discount_percent > 0 && (
                                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                    {p.discount_percent}% OFF
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-[10px] text-muted-custom">
                                <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                                  <Star size={10} className="fill-current" />
                                  {p.rating}
                                </span>
                                <span>•</span>
                                <span className="truncate">{p.brand}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleAddToCart(p)}
                              className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all shrink-0 active:scale-95 shadow-2xs"
                              title="Add to Cart"
                            >
                              <ShoppingBag size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sug)}
                          className="px-2.5 py-1 bg-background hover:bg-primary/10 border border-border-custom/80 hover:border-primary/40 text-foreground font-bold text-[10px] rounded-lg transition-all text-left flex items-center gap-1 cursor-pointer"
                        >
                          <span>{sug}</span>
                          <ChevronRight size={10} className="text-muted-custom" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`text-[9px] block text-right font-medium ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-muted-custom'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-2 items-center text-muted-custom">
                <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                  <Sparkles size={14} className="animate-spin" />
                </div>
                <div className="bg-card border border-border-custom/80 rounded-2xl p-3 rounded-tl-xs flex items-center gap-2">
                  <span className="text-[11px] font-bold">Searching live marketplace catalog...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-card border-t border-border-custom/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me: 'Soybean seeds under ₹1000' or 'Office chairs'..."
                className="flex-1 bg-background border border-border-custom/80 px-3.5 py-2.5 rounded-2xl text-xs text-foreground placeholder:text-muted-custom focus:outline-none focus:border-primary font-semibold"
                disabled={isSending}
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-2xl transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
                title="Send Message"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
