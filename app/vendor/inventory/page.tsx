'use client';

import React, { useState } from 'react';
import { useVendorInventoryQuery, useUpdateVendorInventoryMutation } from '../../../hooks/useVendor';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { VendorSidebar } from '../../../components/VendorSidebar';
import { Boxes, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function VendorInventoryPage() {
  const { data: inventory = [], isLoading } = useVendorInventoryQuery();
  const updateMutation = useUpdateVendorInventoryMutation();

  const [stockInputs, setStockInputs] = useState<Record<number, number>>({});
  const [updatedNotice, setUpdatedNotice] = useState<number | null>(null);

  const handleStockChange = (productId: number, qty: number) => {
    setStockInputs((prev) => ({ ...prev, [productId]: qty }));
  };

  const handleSaveStock = (productId: number, currentQty: number) => {
    const qtyToSave = stockInputs[productId] !== undefined ? stockInputs[productId] : currentQty;
    updateMutation.mutate(
      { productId, stock_quantity: qtyToSave },
      {
        onSuccess: () => {
          setUpdatedNotice(productId);
          setTimeout(() => setUpdatedNotice(null), 2500);
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Vendor Portal', href: '/vendor' }, { label: 'Inventory & Stock' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <VendorSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Boxes className="w-6 h-6 text-primary" />
              <span>Inventory & Stock Control</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Adjust stock quantities in real time to prevent out-of-stock cancellations.
            </p>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading inventory levels...
            </div>
          ) : inventory.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Boxes className="w-10 h-10 text-foreground/30 mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Inventory Records</h3>
              <p className="text-xs text-foreground/60">List products first to manage their stock levels.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inventory.map((item) => {
                const isLowStock = item.stock_quantity <= 5;
                const inputValue =
                  stockInputs[item.id] !== undefined ? stockInputs[item.id] : item.stock_quantity;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card border border-border/40 rounded-3xl shadow-sm hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 shrink-0 bg-muted/30 rounded-2xl p-1 flex items-center justify-center overflow-hidden border border-border/40">
                        <img src={item.images?.[0] || '/placeholder-product.png'} alt={item.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                        <span className="text-xs text-foreground/50 font-mono block">
                          SKU: {item.sku || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:justify-end">
                      {isLowStock && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Stock</span>
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={inputValue}
                          onChange={(e) => handleStockChange(item.id, Number(e.target.value))}
                          className="w-20 bg-muted/30 border border-border/40 rounded-xl px-3 py-1.5 text-xs font-bold text-foreground text-center focus:outline-none focus:border-primary"
                        />

                        <button
                          onClick={() => handleSaveStock(item.id, item.stock_quantity)}
                          disabled={updateMutation.isPending}
                          className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          {updatedNotice === item.id ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Update</span>
                            </>
                          )}
                        </button>
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
  );
}
