'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  liveShoppingService,
  LiveSessionItem,
} from '@/services/liveShoppingService';
import {
  Radio,
  Play,
  Calendar,
  Users,
  Heart,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Flame,
  Clock,
  ShieldCheck,
  Video,
} from 'lucide-react';

export default function LiveShoppingDiscoveryPage() {
  const [sessions, setSessions] = useState<LiveSessionItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [filterStatus]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await liveShoppingService.getSessions(
        filterStatus === 'all' ? undefined : filterStatus
      );
      setSessions(data || []);
    } catch (e) {
      console.error('Failed to load live sessions', e);
    } finally {
      setIsLoading(false);
    }
  };

  const liveSessions = sessions.filter((s) => s.status === 'live');
  const upcomingSessions = sessions.filter((s) => s.status === 'scheduled');

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-indigo-900 text-white p-8 sm:p-12 shadow-2xl space-y-4">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-300"></span>
              </span>
              <span>JSS Live Stream Commerce (Feature 161)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Watch. Interact. <br />
              <span className="text-amber-300">Shop in Real-Time.</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
              Experience interactive live shopping sessions hosted by top manufacturers, verified sellers, and expert brand creators. Exclusive live discounts available only during stream broadcasts.
            </p>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 bg-[radial-gradient(circle_at_center,white_0,transparent_100%)] pointer-events-none" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 border-b border-border-custom/80 pb-4">
          {[
            { id: 'all', label: 'All Shows' },
            { id: 'live', label: '🔴 Live Now', count: liveSessions.length },
            { id: 'scheduled', label: '📅 Upcoming Shows', count: upcomingSessions.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-card border border-border-custom/80 text-muted-custom hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 bg-black/20 text-white rounded-full text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Section 1: Live Now Shows */}
        {liveSessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
              </span>
              <h2 className="text-lg font-black text-foreground uppercase tracking-wider">
                Live Now On Air
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/live/${session.slug || session.id}`}
                  className="group bg-card border border-border-custom/80 rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img
                        src={session.thumbnail || '/placeholder-product.png'}
                        alt={session.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />

                      {/* Live Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-rose-600 text-white text-[10px] font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                        <Radio size={12} className="animate-pulse" />
                        <span>LIVE</span>
                      </div>

                      {/* Viewers Counter */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-xl flex items-center gap-1">
                        <Users size={11} />
                        <span>{session.viewers_count || 142} watching</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-black text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {session.title}
                      </h3>
                      <p className="text-xs text-muted-custom line-clamp-2 font-medium">
                        {session.description || 'Join live product demo, live Q&A, and exclusive flash deals!'}
                      </p>

                      {/* Pinned Products Carousel Preview */}
                      {session.products && session.products.length > 0 && (
                        <div className="pt-2 border-t border-border-custom/60 flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-muted-custom">
                            {session.products.length} Products
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-background-secondary border-t border-border-custom/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Host: {session.seller?.vendor_store?.store_name || session.seller?.name || 'JSS Official'}
                    </span>
                    <span className="text-xs font-black text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Watch & Buy</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Scheduled Shows / Upcoming */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-foreground uppercase tracking-wider flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <span>Upcoming Scheduled Broadcasts</span>
          </h2>

          {upcomingSessions.length === 0 ? (
            <div className="bg-card border border-border-custom/80 rounded-3xl p-12 text-center space-y-2">
              <Video size={36} className="text-muted-custom mx-auto" />
              <h3 className="font-bold text-foreground text-sm">No more upcoming shows today</h3>
              <p className="text-xs text-muted-custom">
                Check back soon or tune in to live replays!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-card border border-border-custom/80 rounded-3xl overflow-hidden shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img
                        src={session.thumbnail || '/placeholder-product.png'}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                        <Clock size={12} />
                        <span>UPCOMING</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-black text-sm text-foreground line-clamp-1">
                        {session.title}
                      </h3>
                      <p className="text-xs text-muted-custom line-clamp-2 font-medium">
                        {session.description || 'Exclusive live stream showcase with special live voucher discounts.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-background-secondary border-t border-border-custom/60 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-muted-custom">
                      {new Date(session.scheduled_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={() => alert(`Reminder set for ${session.title}!`)}
                      className="px-3 py-1.5 bg-primary text-white font-bold rounded-xl text-[11px] shadow-2xs hover:bg-primary-hover transition-all"
                    >
                      Remind Me
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
