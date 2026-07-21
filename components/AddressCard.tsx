'use client';

import React from 'react';
import { ApiAddress } from '../types/api';
import { MapPin, Check, Phone, Trash2 } from 'lucide-react';

interface AddressCardProps {
  address: ApiAddress;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export function AddressCard({ address, isSelected, onSelect, onDelete }: AddressCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
        isSelected
          ? 'bg-primary/5 border-primary shadow-md ring-2 ring-primary/20'
          : 'bg-card border-border/40 hover:border-primary/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-foreground/50'}`} />
          <span className="font-bold text-sm text-foreground">{address.full_name}</span>
        </div>
        {address.is_default && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            Default
          </span>
        )}
      </div>

      <p className="text-xs text-foreground/70 leading-relaxed font-medium">
        {address.address_line_1}
        {address.address_line_2 ? `, ${address.address_line_2}` : ''}, {address.city}, {address.state} -{' '}
        <span className="font-bold text-foreground">{address.pincode}</span>
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
        <span className="inline-flex items-center gap-1 text-foreground/60">
          <Phone className="w-3 h-3" />
          <span>{address.phone}</span>
        </span>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-foreground/40 hover:text-rose-500 transition-colors"
            title="Delete Address"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isSelected && (
        <div className="absolute top-4 right-4 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      )}
    </div>
  );
}
