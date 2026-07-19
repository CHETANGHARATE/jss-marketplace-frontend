import Link from 'next/link';
import { Store, Package, IndianRupee, TrendingUp, ArrowRight } from 'lucide-react';

const stats = [
  { icon: Package, label: 'Active Listings', value: '0' },
  { icon: IndianRupee, label: 'Total Sales', value: '₹0' },
  { icon: TrendingUp, label: 'This Month', value: '₹0' }
];

export default function SellerDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Store size={26} />
        </div>
        <h1 className="text-2xl font-black text-foreground">Seller Dashboard</h1>
        <p className="text-sm text-muted-custom mt-2 font-medium max-w-lg">
          You haven&apos;t registered as a seller yet. Complete your seller application to start listing products on JSS Solutions Marketplace.
        </p>
        <Link
          href="/seller/register"
          className="inline-flex items-center gap-2 mt-5 text-sm font-bold bg-accent text-white px-5 py-3 rounded-2xl hover:bg-accent-hover transition-all shadow-sm"
        >
          Complete Seller Registration
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border-custom rounded-2xl p-5 shadow-sm">
              <Icon size={20} className="text-primary mb-2" />
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-custom font-semibold mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
