'use client';

import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface CartItemCardProps {
  item: {
    product: Product;
    quantity: number;
  };
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const { product, quantity } = item;
  const itemSubtotal = product.offerPrice * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card border border-border/40 rounded-3xl shadow-sm hover:border-primary/40 transition-all">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="h-20 w-20 shrink-0 bg-muted/20 rounded-2xl p-2 flex items-center justify-center overflow-hidden border border-border/40">
          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
        </div>

        <div className="min-w-0 space-y-1">
          <span className="text-[11px] font-bold text-primary uppercase">{product.brand}</span>
          <h4 className="font-bold text-sm text-foreground truncate hover:text-primary transition-colors">
            {product.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-primary">₹{product.offerPrice.toLocaleString()}</span>
            {product.originalPrice > product.offerPrice && (
              <span className="text-xs text-foreground/50 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40">
        <div className="flex items-center border border-border/40 rounded-xl bg-card">
          <button
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="p-2 text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
            title="Decrease Quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-foreground">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            className="p-2 text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
            title="Increase Quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-right min-w-[90px]">
          <span className="text-xs text-foreground/50 block font-medium">Subtotal</span>
          <span className="text-base font-black text-foreground">₹{itemSubtotal.toLocaleString()}</span>
        </div>

        <button
          onClick={() => onRemove(product.id)}
          className="p-2 text-foreground/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
          title="Remove Item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
