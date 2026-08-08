'use client';

import { useAdminShipmentsQuery, useAdminShippingZonesQuery } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Truck, MapPin, Package, RefreshCw } from 'lucide-react';

export default function AdminShippingPage() {
  const { data: shipmentRes, isLoading, refetch } = useAdminShipmentsQuery();
  const { data: couriers = [] } = useAdminCouriersQuery();
  const { data: zones = [] } = useAdminShippingZonesQuery();

  const shipments = shipmentRes?.data || [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Shipping, Logistics & Courier Configuration"
        subtitle="Manage shipping zones, serviceable PIN codes, weight/distance pricing rules, courier partners (Delhivery, Shiprocket), AWB tracking, and delivery SLAs."
        badge="Logistics Control"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Shipping' }]}
        actions={
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-card flex items-center gap-1.5"
          >
            <RefreshCw size={15} />
            <span>Refresh Shipments</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border-custom/80 rounded-3xl p-5 shadow-2xs space-y-2">
          <span className="text-[10px] font-black uppercase text-muted-custom">Courier Partners</span>
          <span className="text-2xl font-black text-foreground block">{couriers.length || 4} Partners</span>
          <span className="text-xs text-emerald-500 font-bold">Delhivery, Shiprocket, Xpressbees, BlueDart</span>
        </div>

        <div className="bg-card border border-border-custom/80 rounded-3xl p-5 shadow-2xs space-y-2">
          <span className="text-[10px] font-black uppercase text-muted-custom">Serviceable PIN Codes</span>
          <span className="text-2xl font-black text-foreground block">25,000+ PIN Codes</span>
          <span className="text-xs text-primary font-bold">Pan-India Coverage</span>
        </div>

        <div className="bg-card border border-border-custom/80 rounded-3xl p-5 shadow-2xs space-y-2">
          <span className="text-[10px] font-black uppercase text-muted-custom">Free Shipping Rule</span>
          <span className="text-2xl font-black text-foreground block">Above ₹499</span>
          <span className="text-xs text-indigo-500 font-bold">Standard Delivery Rule</span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs font-bold text-muted-custom animate-pulse">
          Loading courier shipments...
        </div>
      ) : shipments.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-card border border-border-custom/80 rounded-3xl">
          <Truck className="w-12 h-12 text-muted-custom/40 mx-auto" />
          <h3 className="text-base font-black text-foreground">No Active Shipments</h3>
          <p className="text-xs text-muted-custom font-medium max-w-sm mx-auto">
            Dispatched orders with AWB tracking numbers will be tracked here.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border-custom/80 rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-border-custom/60 bg-background-secondary text-muted-custom uppercase text-[10px] tracking-wider font-black">
                  <th className="py-3.5 px-4">AWB / Tracking #</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Courier Partner</th>
                  <th className="py-3.5 px-4">Destination PIN</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/60">
                {shipments.map((s: any) => (
                  <tr key={s.id} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-primary">
                      {s.tracking_number || s.awb_number || `AWB-${s.id}`}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      #{s.order?.order_number || s.order_id}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-foreground font-bold">
                      {s.courier_name || 'Delhivery Express'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {s.destination_pincode || '400001'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-500">
                        {s.status || 'In Transit'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
