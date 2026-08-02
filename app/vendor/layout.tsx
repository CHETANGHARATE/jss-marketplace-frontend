'use client';

import React from 'react';
import { VendorGuard } from '../../components/VendorGuard';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return <VendorGuard>{children}</VendorGuard>;
}
