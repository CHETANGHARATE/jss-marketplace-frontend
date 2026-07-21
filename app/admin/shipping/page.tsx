'use client';

import React from 'react';
import { useAdminShipmentsQuery } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { Truck } from 'lucide-react';

export default function AdminShippingPage() {
  const { data, isLoading } = useAdminShipmentsQuery();
  const shipments = data?.data || [];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Logistics & Shipping' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Truck className="w-6 h-6 text-rose-500" />
              <span>Platform Logistics & Courier Dispatch</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Monitor active courier shipments, AWB tracking numbers, and delivery SLAs.
            </p>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading shipment logistics...
            </div>
          ) : shipments.length === 0 ? (
            <div className="py-12 text-center text-xs text-foreground/50 bg-muted/20 rounded-2xl">
              No active courier shipments.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border/40 text-foreground/50 uppercase text-[10px]">
                    <th className="pb-3 px-2">AWB Tracking</th>
                    <th className="pb-3 px-2">Order Ref</th>
                    <th className="pb-3 px-2">Courier Partner</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Est. Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {shipments.map((ship) => (
                    <tr key={ship.id} className="hover:bg-muted/20">
                      <td className="py-3.5 px-2 font-mono font-bold text-rose-500">{ship.tracking_number}</td>
                      <td className="py-3.5 px-2 font-mono text-foreground/70">#{ship.order_number}</td>
                      <td className="py-3.5 px-2 font-bold text-foreground">{ship.courier_name}</td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ship.status === 'delivered'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {ship.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right text-foreground/60 font-medium">
                        {ship.estimated_delivery}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
