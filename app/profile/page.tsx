'use client';

import React, { useState } from 'react';
import { User, Package, Heart, MapPin, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { useCartWishlist } from '../../contexts/CartWishlistContext';

const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { wishlist } = useCartWishlist();

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
        <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-2xl shrink-0">
          JD
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl font-black text-foreground">John Doe</h1>
          <p className="text-sm text-muted-custom mt-1">john.doe@example.com</p>
          <p className="text-sm text-muted-custom">+91 98765 43210</p>
        </div>
        <button className="text-xs font-bold bg-primary text-white px-4 py-2.5 rounded-2xl hover:bg-primary-hover transition-all shrink-0">
          Edit Profile
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-card border border-border-custom rounded-3xl p-3 space-y-1 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-foreground hover:bg-background-secondary'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-accent hover:bg-background-secondary transition-all">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 bg-card border border-border-custom rounded-3xl p-6 sm:p-8 shadow-sm min-h-[320px]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-foreground">Account overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-background-secondary rounded-2xl p-5 border border-border-custom">
                  <Package size={20} className="text-primary mb-2" />
                  <p className="text-2xl font-black text-foreground">0</p>
                  <p className="text-xs text-muted-custom font-semibold mt-1">Total Orders</p>
                </div>
                <div className="bg-background-secondary rounded-2xl p-5 border border-border-custom">
                  <Heart size={20} className="text-accent mb-2" />
                  <p className="text-2xl font-black text-foreground">{wishlist.length}</p>
                  <p className="text-xs text-muted-custom font-semibold mt-1">Wishlist Items</p>
                </div>
                <div className="bg-background-secondary rounded-2xl p-5 border border-border-custom">
                  <MapPin size={20} className="text-primary mb-2" />
                  <p className="text-2xl font-black text-foreground">0</p>
                  <p className="text-xs text-muted-custom font-semibold mt-1">Saved Addresses</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <ShoppingBag size={48} className="text-muted-custom/40 mb-4" />
              <h3 className="font-bold text-foreground mb-1">No orders yet</h3>
              <p className="text-sm text-muted-custom">Your order history will show up here once you shop with us.</p>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Your wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <Heart size={48} className="text-muted-custom/40 mb-4" />
                  <p className="text-sm text-muted-custom">Nothing saved yet. Tap the heart icon on any product to save it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlist.map((prod) => (
                    <div key={prod.id} className="bg-background-secondary rounded-2xl border border-border-custom p-3">
                      <img src={prod.image} alt={prod.name} className="h-24 w-full object-cover rounded-xl mb-2" />
                      <p className="text-sm font-semibold text-foreground truncate">{prod.name}</p>
                      <p className="text-xs text-primary font-bold">₹{prod.offerPrice.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <MapPin size={48} className="text-muted-custom/40 mb-4" />
              <h3 className="font-bold text-foreground mb-1">No saved addresses</h3>
              <p className="text-sm text-muted-custom mb-4">Add a delivery address to check out faster next time.</p>
              <button className="text-xs font-bold bg-primary text-white px-5 py-2.5 rounded-2xl hover:bg-primary-hover transition-all">
                Add Address
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-md">
              <h2 className="text-lg font-bold text-foreground">Account settings</h2>
              <div>
                <label className="text-xs font-semibold text-muted-custom">Full Name</label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full mt-1 bg-background-secondary border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-custom">Email</label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full mt-1 bg-background-secondary border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <button className="text-xs font-bold bg-primary text-white px-5 py-2.5 rounded-2xl hover:bg-primary-hover transition-all">
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
