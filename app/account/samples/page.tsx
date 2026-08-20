'use client';

import React, { useEffect, useState } from 'react';
import { AccountSidebar } from '@/components/AccountSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { b2bService, SampleRequest } from '@/services/b2bService';
import { useToast } from '@/components/Toast';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

export default function AccountSamplesPage() {
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSamples = async () => {
    setLoading(true);
    try {
      const data = await b2bService.getSampleRequests();
      setSamples(data || []);
    } catch (err) {
      console.error('Failed to load sample requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'Sample Orders' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <main className="flex-1 w-full space-y-6">
          <div className="p-6 bg-card border border-border/60 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-border/40">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground">B2B Sample Orders</h1>
                <p className="text-xs text-muted-foreground">
                  Order evaluation samples before committing to large wholesale container shipments.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Loading sample requests...</p>
              </div>
            ) : samples.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <h3 className="font-bold text-base text-foreground">No Sample Orders Requested</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  You can request product testing samples directly from any wholesale product page.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {samples.map((sample) => (
                  <div
                    key={sample.id}
                    className="p-5 border border-border/60 rounded-2xl bg-background-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-primary">#{sample.sample_request_number}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {sample.status}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Requested: {new Date(sample.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-foreground">
                        {sample.product?.name || 'Evaluation Sample Item'}
                      </h4>

                      <span className="text-[11px] text-muted-foreground block">
                        Sample Qty: <strong>{sample.quantity} unit(s)</strong> • Supplier:{' '}
                        <strong>{sample.seller?.vendor_store?.store_name || sample.seller?.name || 'Verified Vendor'}</strong>
                      </span>

                      {sample.tracking_number && (
                        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold pt-1">
                          <Truck className="w-3.5 h-3.5" />
                          <span>
                            Shipped via {sample.courier_name || 'Courier'}: {sample.tracking_number}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-muted-foreground block">Sample Charge</span>
                      <span className="text-base font-black text-foreground">
                        ₹{Number(sample.sample_price * sample.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
