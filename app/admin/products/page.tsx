'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  useAdminProductsQuery,
  useAdminPendingProductsQuery,
  useApproveProductMutation,
  useRejectProductMutation,
  useRequestProductChangesMutation,
  useUnpublishProductMutation,
  usePublishProductMutation,
  useDeleteAdminProductMutation,
  useDuplicateAdminProductMutation,
  useArchiveProductMutation,
  useRestoreProductMutation,
  useBulkActionProductsMutation,
} from '@/hooks/useAdmin';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  Package,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  EyeOff,
  Globe,
  Copy,
  Trash2,
  Clock,
  AlertTriangle,
  Building2,
  Tag,
  Layers,
  Truck,
  ShieldCheck,
  Archive,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Filter,
  ArrowUpDown,
  BarChart3,
  Grid,
  CheckSquare,
  Square,
  FileSpreadsheet,
} from 'lucide-react';
import { ApiProduct } from '@/types/api';

const getCategoryNameStr = (cat: any): string => {
  if (!cat) return 'Uncategorized / General';
  const name = cat.name;
  if (typeof name === 'string' && name.trim()) return name;
  if (typeof name === 'object' && name !== null) {
    return name.en || name.hi || name.mr || Object.values(name)[0] || 'Uncategorized / General';
  }
  return 'Uncategorized / General';
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'draft' | 'rejected' | 'hidden' | 'archived'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Accordion open/close state per category key (default: all expanded)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  // Per-category internal search and sorting
  const [categorySearches, setCategorySearches] = useState<Record<string, string>>({});
  const [categorySorts, setCategorySorts] = useState<Record<string, string>>({});

  const statusParam = (activeTab !== 'all' && activeTab !== 'pending') ? activeTab : undefined;
  const { data: allProductsData, isLoading: isLoadingAll } = useAdminProductsQuery({ search, status: statusParam });
  const { data: pendingProductsData, isLoading: isLoadingPending } = useAdminPendingProductsQuery();

  const approveMutation = useApproveProductMutation();
  const rejectMutation = useRejectProductMutation();
  const requestChangesMutation = useRequestProductChangesMutation();
  const unpublishMutation = useUnpublishProductMutation();
  const publishMutation = usePublishProductMutation();
  const archiveMutation = useArchiveProductMutation();
  const restoreMutation = useRestoreProductMutation();
  const deleteMutation = useDeleteAdminProductMutation();
  const duplicateMutation = useDuplicateAdminProductMutation();
  const bulkActionMutation = useBulkActionProductsMutation();

  const [rejectingProduct, setRejectingProduct] = useState<ApiProduct | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [requestingChangesProduct, setRequestingChangesProduct] = useState<ApiProduct | null>(null);
  const [changeInstructions, setChangeInstructions] = useState('');

  const [deletingProduct, setDeletingProduct] = useState<ApiProduct | null>(null);
  const [inspectingProduct, setInspectingProduct] = useState<ApiProduct | null>(null);

  const extractProductsArray = (resData: any): ApiProduct[] => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.data?.data)) return resData.data.data;
    return [];
  };

  const allProducts = extractProductsArray(allProductsData);
  const pendingProducts = extractProductsArray(pendingProductsData);

  const rawProducts = activeTab === 'pending' ? pendingProducts : allProducts;
  const isLoading = activeTab === 'pending' ? isLoadingPending : isLoadingAll;

  // Filter products by search and category filter dropdown
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((prod) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const prodName = (typeof prod.name === 'string' ? prod.name : (prod.name as any)?.en || '').toLowerCase();
        const prodSku = (prod.sku || '').toLowerCase();
        const brandName = (prod.brand?.name || '').toLowerCase();
        const sellerName = (prod.seller?.name || '').toLowerCase();
        if (!prodName.includes(q) && !prodSku.includes(q) && !brandName.includes(q) && !sellerName.includes(q)) {
          return false;
        }
      }

      if (selectedCategoryFilter !== 'all') {
        const catId = String(prod.category_id || prod.category?.id || 'uncategorized');
        if (catId !== selectedCategoryFilter) return false;
      }

      return true;
    });
  }, [rawProducts, search, selectedCategoryFilter]);

  // Build unique category dropdown list
  const availableCategoriesList = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    allProducts.forEach((prod) => {
      const cId = String(prod.category_id || prod.category?.id || 'uncategorized');
      const cName = getCategoryNameStr(prod.category);
      if (!map.has(cId)) {
        map.set(cId, { id: cId, name: cName });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allProducts]);

  // Group products category-wise
  const categoryGroups = useMemo(() => {
    const groupsMap = new Map<string, { categoryId: string; categoryName: string; products: ApiProduct[] }>();

    filteredProducts.forEach((prod) => {
      const cId = String(prod.category_id || prod.category?.id || 'uncategorized');
      const cName = getCategoryNameStr(prod.category);
      const key = `${cId}_${cName}`;

      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          categoryId: cId,
          categoryName: cName,
          products: [],
        });
      }
      groupsMap.get(key)!.products.push(prod);
    });

    return Array.from(groupsMap.values()).sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  }, [filteredProducts]);

  // Master Accordion Controls
  const toggleCategoryExpand = (key: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: prev[key] === undefined ? false : !prev[key],
    }));
  };

  const expandAllCategories = () => {
    const next: Record<string, boolean> = {};
    categoryGroups.forEach((g) => {
      next[`${g.categoryId}_${g.categoryName}`] = true;
    });
    setExpandedCategories(next);
  };

  const collapseAllCategories = () => {
    const next: Record<string, boolean> = {};
    categoryGroups.forEach((g) => {
      next[`${g.categoryId}_${g.categoryName}`] = false;
    });
    setExpandedCategories(next);
  };

  // Actions
  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync(id);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error approving product.');
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await unpublishMutation.mutateAsync(id);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error unpublishing product.');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await publishMutation.mutateAsync(id);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error publishing product.');
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await duplicateMutation.mutateAsync(id);
      setOpenMenuId(null);
      alert('Product duplicated as a Draft copy.');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error cloning product.');
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await archiveMutation.mutateAsync(id);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error archiving product.');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreMutation.mutateAsync(id);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error restoring product.');
    }
  };

  const toggleSelectProduct = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllCategory = (catProducts: ApiProduct[]) => {
    const catIds = catProducts.map((p) => p.id);
    const allSelected = catIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !catIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...catIds])));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to apply '${action}' to ${selectedIds.length} selected products?`)) return;

    try {
      await bulkActionMutation.mutateAsync({ product_ids: selectedIds, action });
      setSelectedIds([]);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error executing bulk action.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteMutation.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error deleting product.');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingProduct || !rejectReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: rejectingProduct.id, reason: rejectReason });
      setRejectingProduct(null);
      setRejectReason('');
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error rejecting product.');
    }
  };

  const handleConfirmRequestChanges = async () => {
    if (!requestingChangesProduct || !changeInstructions.trim()) return;
    try {
      await requestChangesMutation.mutateAsync({ id: requestingChangesProduct.id, instructions: changeInstructions });
      setRequestingChangesProduct(null);
      setChangeInstructions('');
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error requesting changes.');
    }
  };

  // Summary Metrics
  const totalCategoriesCount = availableCategoriesList.length;
  const totalProductsCount = allProducts.length;
  const pendingProductsCount = pendingProducts.length || allProducts.filter((p) => p.status === 'pending_approval' || p.status === 'pending_review' || p.status === 'pending').length;
  const approvedProductsCount = allProducts.filter((p) => p.status === 'approved').length;

  return (
    <div className="space-y-8" onClick={() => setOpenMenuId(null)}>
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Category-Wise Product Catalog' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          {/* Header */}
          <div className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                <Package className="w-6 h-6 text-rose-500" />
                <span>Admin Category-Wise Product Management</span>
              </h1>
              <p className="text-xs text-foreground/60 font-medium mt-1">
                Organized category-wise product catalog with accordion grouping, search, sorting, and lifecycle moderation.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <Link
                href="/admin/products/import"
                className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-2xl hover:bg-emerald-700 transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Bulk Import</span>
              </Link>
              <Link
                href="/admin/products/create"
                className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Product</span>
              </Link>
            </div>
          </div>

          {/* 7. Quick Statistics Cards Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 flex items-center gap-1">
                <Grid className="w-3.5 h-3.5 text-blue-500" /> Total Categories
              </span>
              <p className="text-xl font-black text-foreground">{totalCategoriesCount}</p>
            </div>

            <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-purple-500" /> Total Products
              </span>
              <p className="text-xl font-black text-foreground">{totalProductsCount}</p>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending Moderations
              </span>
              <p className="text-xl font-black text-amber-600">{pendingProductsCount}</p>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Approved Live
              </span>
              <p className="text-xl font-black text-emerald-600">{approvedProductsCount}</p>
            </div>
          </div>

          {/* 4. Pill-Style Horizontal Status Filter Tabs */}
          <div className="overflow-x-auto scrollbar-none pb-1">
            <div className="flex items-center gap-2 min-w-max p-1 bg-muted/20 border border-border/40 rounded-3xl">
              {[
                { id: 'all', label: 'All Products', count: allProducts.length, color: 'bg-rose-500 text-white shadow-xs' },
                { id: 'pending', label: 'Pending Review', count: pendingProductsCount, color: 'bg-amber-500 text-white shadow-xs', icon: Clock },
                { id: 'approved', label: 'Approved', count: allProducts.filter((p) => p.status === 'approved').length, color: 'bg-emerald-600 text-white shadow-xs', icon: CheckCircle2 },
                { id: 'draft', label: 'Draft', count: allProducts.filter((p) => p.status === 'draft').length, color: 'bg-slate-600 text-white shadow-xs' },
                { id: 'rejected', label: 'Rejected', count: allProducts.filter((p) => p.status === 'rejected').length, color: 'bg-rose-600 text-white shadow-xs', icon: XCircle },
                { id: 'hidden', label: 'Hidden', count: allProducts.filter((p) => p.status === 'hidden').length, color: 'bg-amber-600 text-white shadow-xs', icon: EyeOff },
                { id: 'archived', label: 'Archived', count: allProducts.filter((p) => p.status === 'archived').length, color: 'bg-purple-600 text-white shadow-xs', icon: Archive },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shrink-0 ${
                      isActive
                        ? `${tab.color} scale-[1.02]`
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive
                          ? 'bg-white/20 text-current'
                          : 'bg-card border border-border/50 text-foreground/70'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bulk Operations Toolbar */}
          {selectedIds.length > 0 && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-extrabold text-rose-500">
                {selectedIds.length} item(s) selected
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all text-[11px]"
                >
                  Bulk Publish
                </button>
                <button
                  onClick={() => handleBulkAction('unpublish')}
                  className="px-3 py-1.5 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-all text-[11px]"
                >
                  Bulk Unpublish
                </button>
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all text-[11px]"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all text-[11px]"
                >
                  Bulk Archive
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all text-[11px]"
                >
                  Bulk Delete
                </button>
              </div>
            </div>
          )}

          {/* 5 & 6. Global Search, Category Filter Dropdown & Master Accordion Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Global Search Bar */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search across all categories by product title, SKU, brand, or vendor..."
                className="w-full bg-muted/30 border border-border/40 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-rose-500"
              />
              <Search className="w-4 h-4 text-foreground/40 absolute left-3.5 top-3" />
            </div>

            {/* Category Filter Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full appearance-none bg-muted/30 border border-border/40 rounded-2xl py-2.5 pl-9 pr-8 text-xs font-bold text-foreground focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="all">All Categories ({availableCategoriesList.length})</option>
                  {availableCategoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 text-foreground/40 absolute left-3 top-3 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-foreground/40 absolute right-3 top-3 pointer-events-none" />
              </div>

              {/* Expand All / Collapse All Controls */}
              <div className="flex items-center gap-1 border border-border/40 rounded-2xl p-1 bg-muted/20 shrink-0">
                <button
                  onClick={expandAllCategories}
                  className="px-2.5 py-1 text-[11px] font-bold text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-xl transition-all"
                  title="Expand all category accordions"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAllCategories}
                  className="px-2.5 py-1 text-[11px] font-bold text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-xl transition-all"
                  title="Collapse all category accordions"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>

          {/* Product Category Accordion List */}
          {isLoading ? (
            <div className="py-16 text-center text-xs text-foreground/50 animate-pulse space-y-2">
              <Package className="w-8 h-8 text-rose-500 animate-bounce mx-auto" />
              <p>Loading marketplace product catalog by categories...</p>
            </div>
          ) : categoryGroups.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-muted/10 border border-border/40 rounded-3xl">
              <Package className="w-10 h-10 text-foreground/30 mx-auto" />
              <h3 className="text-base font-bold text-foreground">
                {activeTab === 'pending' ? 'No Pending Moderations' : 'No Matching Products Found'}
              </h3>
              <p className="text-xs text-foreground/60 max-w-sm mx-auto">
                {activeTab === 'pending'
                  ? 'All vendor product submissions have been reviewed.'
                  : 'Try adjusting your search criteria or category filter dropdown.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryGroups.map((group) => {
                const groupKey = `${group.categoryId}_${group.categoryName}`;
                const isExpanded = expandedCategories[groupKey] !== false; // Expanded by default

                const internalSearch = categorySearches[groupKey] || '';
                const internalSort = categorySorts[groupKey] || 'latest';

                // Filter & sort category products internally
                let groupProducts = group.products.filter((p) => {
                  if (!internalSearch.trim()) return true;
                  const q = internalSearch.toLowerCase();
                  const pName = (typeof p.name === 'string' ? p.name : (p.name as any)?.en || '').toLowerCase();
                  const pSku = (p.sku || '').toLowerCase();
                  return pName.includes(q) || pSku.includes(q);
                });

                groupProducts.sort((a, b) => {
                  const priceA = a.offerPrice ?? a.originalPrice ?? 0;
                  const priceB = b.offerPrice ?? b.originalPrice ?? 0;
                  const stockA = a.stockQuantity ?? a.stock_quantity ?? 0;
                  const stockB = b.stockQuantity ?? b.stock_quantity ?? 0;

                  if (internalSort === 'oldest') return a.id - b.id;
                  if (internalSort === 'price_asc') return priceA - priceB;
                  if (internalSort === 'price_desc') return priceB - priceA;
                  if (internalSort === 'stock_asc') return stockA - stockB;
                  if (internalSort === 'stock_desc') return stockB - stockA;
                  return b.id - a.id; // latest
                });

                const groupSelectedCount = groupProducts.filter((p) => selectedIds.includes(p.id)).length;
                const isAllGroupSelected = groupProducts.length > 0 && groupSelectedCount === groupProducts.length;

                return (
                  <div
                    key={groupKey}
                    className="border border-border/50 rounded-2xl overflow-hidden bg-card transition-all shadow-2xs"
                  >
                    {/* 2. Category Section Header */}
                    <div
                      onClick={() => toggleCategoryExpand(groupKey)}
                      className="px-5 py-4 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none border-b border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold shrink-0">
                          <FolderOpen className="w-4 h-4" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-extrabold text-sm text-foreground">{group.categoryName}</h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-black">
                              {group.products.length} {group.products.length === 1 ? 'Product' : 'Products'}
                            </span>
                          </div>
                          <span className="text-[11px] text-foreground/50 font-medium">Category ID: {group.categoryId}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        {/* Per-Category Search */}
                        <div className="relative hidden md:block w-40">
                          <input
                            type="text"
                            value={internalSearch}
                            onChange={(e) =>
                              setCategorySearches((prev) => ({ ...prev, [groupKey]: e.target.value }))
                            }
                            placeholder="Search in category..."
                            className="w-full bg-background border border-border/40 rounded-xl py-1.5 pl-7 pr-2 text-[11px] font-semibold text-foreground focus:outline-none focus:border-rose-500"
                          />
                          <Search className="w-3 h-3 text-foreground/40 absolute left-2.5 top-2.5" />
                        </div>

                        {/* Per-Category Sort */}
                        <div className="relative hidden sm:block">
                          <select
                            value={internalSort}
                            onChange={(e) =>
                              setCategorySorts((prev) => ({ ...prev, [groupKey]: e.target.value }))
                            }
                            className="appearance-none bg-background border border-border/40 rounded-xl py-1.5 pl-7 pr-6 text-[11px] font-bold text-foreground focus:outline-none focus:border-rose-500 cursor-pointer"
                          >
                            <option value="latest">Sort: Latest</option>
                            <option value="oldest">Sort: Oldest</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="stock_asc">Stock: Low to High</option>
                            <option value="stock_desc">Stock: High to Low</option>
                          </select>
                          <ArrowUpDown className="w-3 h-3 text-foreground/40 absolute left-2.5 top-2.5 pointer-events-none" />
                          <ChevronDown className="w-3 h-3 text-foreground/40 absolute right-2 top-2.5 pointer-events-none" />
                        </div>

                        {/* Expand / Collapse Icon */}
                        <button
                          onClick={() => toggleCategoryExpand(groupKey)}
                          className="p-1.5 text-foreground/60 hover:text-foreground hover:bg-muted/60 rounded-xl transition-all"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-rose-500" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* 3. Category Product Table */}
                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-semibold">
                          <thead>
                            <tr className="border-b border-border/40 text-foreground/50 uppercase text-[10px] bg-muted/10">
                              <th className="py-2.5 px-3 w-8">
                                <input
                                  type="checkbox"
                                  checked={isAllGroupSelected}
                                  onChange={() => toggleSelectAllCategory(groupProducts)}
                                  className="rounded border-border/60 text-rose-500 focus:ring-rose-500 cursor-pointer"
                                />
                              </th>
                              <th className="py-2.5 px-3">Product Item</th>
                              <th className="py-2.5 px-3">Vendor / Seller</th>
                              <th className="py-2.5 px-3">Brand</th>
                              <th className="py-2.5 px-3">Price</th>
                              <th className="py-2.5 px-3">Stock</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3">Date</th>
                              <th className="py-2.5 px-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/30">
                            {groupProducts.map((prod) => {
                              const displayImage = prod.image || prod.images?.[0] || '/placeholder-product.png';
                              const displayPrice = prod.offerPrice ?? prod.originalPrice ?? prod.sale_price ?? prod.original_price ?? 0;
                              const stockQty = prod.stockQuantity ?? prod.stock_quantity ?? 0;
                              const isPending = prod.status === 'pending_approval' || prod.status === 'pending_review';
                              const createdDateStr = prod.created_at ? new Date(prod.created_at).toLocaleDateString() : 'N/A';

                              return (
                                <tr
                                  key={prod.id}
                                  className={`hover:bg-muted/20 ${selectedIds.includes(prod.id) ? 'bg-rose-500/5' : ''}`}
                                >
                                  <td className="py-3 px-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedIds.includes(prod.id)}
                                      onChange={() => toggleSelectProduct(prod.id)}
                                      className="rounded border-border/60 text-rose-500 focus:ring-rose-500 cursor-pointer"
                                    />
                                  </td>

                                  <td className="py-3 px-3 flex items-center gap-3">
                                    <div className="h-10 w-10 shrink-0 bg-[#ECEFF3] dark:bg-slate-900/40 rounded-xl overflow-hidden relative border border-border/40">
                                      <img src={displayImage} alt={prod.name} className="w-full h-full object-cover object-center" />
                                    </div>
                                    <div>
                                      <span className="font-bold text-foreground line-clamp-1">{prod.name}</span>
                                      <span className="text-[10px] font-mono text-foreground/50">SKU: {prod.sku || 'N/A'}</span>
                                    </div>
                                  </td>

                                  <td className="py-3 px-3 font-bold text-foreground/70">
                                    {prod.seller?.name || 'Admin Official'}
                                  </td>

                                  <td className="py-3 px-3 font-semibold text-foreground/70">
                                    {prod.brand?.name || 'Generic'}
                                  </td>

                                  <td className="py-3 px-3 font-black text-rose-500">
                                    ₹{displayPrice.toLocaleString()}
                                  </td>

                                  <td className="py-3 px-3 font-bold text-foreground/80">
                                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                      stockQty === 0 ? 'bg-rose-500/10 text-rose-600' : stockQty < 10 ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                                    }`}>
                                      {stockQty} units
                                    </span>
                                  </td>

                                  <td className="py-3 px-3">
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        prod.status === 'approved'
                                          ? 'bg-emerald-500/10 text-emerald-600'
                                          : isPending
                                          ? 'bg-amber-500/10 text-amber-600'
                                          : prod.status === 'rejected'
                                          ? 'bg-rose-500/10 text-rose-600'
                                          : prod.status === 'hidden'
                                          ? 'bg-slate-500/10 text-slate-600'
                                          : prod.status === 'archived'
                                          ? 'bg-purple-500/10 text-purple-600'
                                          : 'bg-muted text-foreground/60'
                                      }`}
                                    >
                                      {prod.status}
                                    </span>
                                  </td>

                                  <td className="py-3 px-3 text-[11px] font-medium text-foreground/50">
                                    {createdDateStr}
                                  </td>

                                  {/* Kebab Action Menu */}
                                  <td className="py-3 px-3 text-right relative">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === prod.id ? null : prod.id);
                                      }}
                                      className="p-1.5 text-foreground/60 hover:text-foreground hover:bg-muted/40 rounded-xl transition-all"
                                      title="Product Actions"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {openMenuId === prod.id && (
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute right-2 top-10 z-40 bg-card border border-border/60 rounded-2xl shadow-xl w-44 py-1.5 text-left text-xs font-semibold space-y-0.5 backdrop-blur-md"
                                      >
                                        <button
                                          onClick={() => {
                                            setInspectingProduct(prod);
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full px-3 py-1.5 hover:bg-muted/40 flex items-center gap-2 text-foreground/80"
                                        >
                                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                                          <span>Inspect</span>
                                        </button>

                                        <Link
                                          href={`/admin/products/${prod.id}/edit`}
                                          className="w-full px-3 py-1.5 hover:bg-muted/40 flex items-center gap-2 text-foreground/80"
                                        >
                                          <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                                          <span>Edit Product</span>
                                        </Link>

                                        {isPending && (
                                          <>
                                            <button
                                              onClick={() => handleApprove(prod.id)}
                                              className="w-full px-3 py-1.5 hover:bg-emerald-500/10 flex items-center gap-2 text-emerald-600"
                                            >
                                              <CheckCircle2 className="w-3.5 h-3.5" />
                                              <span>Approve</span>
                                            </button>

                                            <button
                                              onClick={() => {
                                                setRequestingChangesProduct(prod);
                                                setOpenMenuId(null);
                                              }}
                                              className="w-full px-3 py-1.5 hover:bg-amber-500/10 flex items-center gap-2 text-amber-600"
                                            >
                                              <Edit3 className="w-3.5 h-3.5" />
                                              <span>Request Changes</span>
                                            </button>

                                            <button
                                              onClick={() => {
                                                setRejectingProduct(prod);
                                                setOpenMenuId(null);
                                              }}
                                              className="w-full px-3 py-1.5 hover:bg-rose-500/10 flex items-center gap-2 text-rose-500"
                                            >
                                              <XCircle className="w-3.5 h-3.5" />
                                              <span>Reject</span>
                                            </button>
                                          </>
                                        )}

                                        {prod.status === 'approved' && (
                                          <button
                                            onClick={() => handleUnpublish(prod.id)}
                                            className="w-full px-3 py-1.5 hover:bg-muted/40 flex items-center gap-2 text-slate-600 dark:text-slate-300"
                                          >
                                            <EyeOff className="w-3.5 h-3.5" />
                                            <span>Unpublish</span>
                                          </button>
                                        )}

                                        {(prod.status === 'hidden' || prod.status === 'rejected') && (
                                          <button
                                            onClick={() => handlePublish(prod.id)}
                                            className="w-full px-3 py-1.5 hover:bg-emerald-500/10 flex items-center gap-2 text-emerald-600"
                                          >
                                            <Globe className="w-3.5 h-3.5" />
                                            <span>Publish</span>
                                          </button>
                                        )}

                                        <button
                                          onClick={() => handleDuplicate(prod.id)}
                                          className="w-full px-3 py-1.5 hover:bg-muted/40 flex items-center gap-2 text-foreground/80"
                                        >
                                          <Copy className="w-3.5 h-3.5 text-purple-500" />
                                          <span>Clone Product</span>
                                        </button>

                                        {prod.status !== 'archived' ? (
                                          <button
                                            onClick={() => handleArchive(prod.id)}
                                            className="w-full px-3 py-1.5 hover:bg-purple-500/10 flex items-center gap-2 text-purple-600"
                                          >
                                            <Archive className="w-3.5 h-3.5" />
                                            <span>Archive</span>
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => handleRestore(prod.id)}
                                            className="w-full px-3 py-1.5 hover:bg-emerald-500/10 flex items-center gap-2 text-emerald-600"
                                          >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                            <span>Restore</span>
                                          </button>
                                        )}

                                        <div className="border-t border-border/40 my-1" />

                                        <button
                                          onClick={() => {
                                            setDeletingProduct(prod);
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full px-3 py-1.5 hover:bg-rose-500/10 flex items-center gap-2 text-rose-500"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>Delete Product</span>
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-border/40 space-y-4">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Delete Product Permanently
            </h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Are you sure you want to delete <strong>"{deletingProduct.name}"</strong>?
              <br />
              <span className="text-rose-500 font-bold block mt-1">This action cannot be undone.</span>
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 text-xs font-bold text-foreground/70 hover:bg-muted/40 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-5 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-border/40 space-y-4">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Reject Product Submission
            </h3>
            <p className="text-xs text-foreground/60">
              Please enter rejection remarks/feedback for vendor <strong>{rejectingProduct.seller?.name || 'Seller'}</strong> regarding "{rejectingProduct.name}".
            </p>
            <textarea
              rows={3}
              placeholder="Provide reason (e.g. Missing high-res image, incorrect pricing, incomplete specifications)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none resize-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingProduct(null)}
                className="px-4 py-2 text-xs font-bold text-foreground/70 hover:bg-muted/40 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="px-5 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {requestingChangesProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-border/40 space-y-4">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-500" /> Request Changes from Vendor
            </h3>
            <p className="text-xs text-foreground/60">
              Enter instructions for vendor <strong>{requestingChangesProduct.seller?.name || 'Seller'}</strong>. The product status will revert to Draft for edits.
            </p>
            <textarea
              rows={3}
              placeholder="Specify required changes (e.g. Please update product dimensions, clarify warranty period)..."
              value={changeInstructions}
              onChange={(e) => setChangeInstructions(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-amber-500 outline-none resize-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRequestingChangesProduct(null)}
                className="px-4 py-2 text-xs font-bold text-foreground/70 hover:bg-muted/40 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRequestChanges}
                disabled={!changeInstructions.trim()}
                className="px-5 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                Send Instructions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Inspector Drawer */}
      {inspectingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-xl border border-border/40 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                  <span>{inspectingProduct.name}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500">
                    {inspectingProduct.status}
                  </span>
                </h3>
                <span className="text-xs text-foreground/60">SKU: {inspectingProduct.sku || 'N/A'}</span>
              </div>
              <button onClick={() => setInspectingProduct(null)} className="text-xs font-bold text-foreground/50 hover:text-foreground">
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="aspect-square bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 flex items-center justify-center overflow-hidden border border-border/40">
                  <img src={inspectingProduct.image || inspectingProduct.images?.[0] || '/placeholder-product.png'} alt={inspectingProduct.name} className="max-h-full max-w-full object-contain" />
                </div>

                {inspectingProduct.images && inspectingProduct.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {inspectingProduct.images.map((img: any, idx: number) => (
                      <div key={idx} className="h-12 w-12 shrink-0 bg-muted/40 rounded-xl p-1 border border-border/40 overflow-hidden">
                        <img src={typeof img === 'string' ? img : (img.image_path || img.image)} alt="Gallery" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-2xl space-y-2 border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-rose-500" /> Vendor Store:</span>
                    <span className="font-black text-foreground">{inspectingProduct.seller?.name || 'Admin Official'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-rose-500" /> Category:</span>
                    <span className="font-bold text-foreground">{getCategoryNameStr(inspectingProduct.category)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-rose-500" /> Brand:</span>
                    <span className="font-bold text-foreground">{inspectingProduct.brand?.name || 'Generic'}</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-2xl space-y-2 border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60">Selling Offer Price:</span>
                    <span className="font-black text-sm text-rose-500">₹{(inspectingProduct.offerPrice ?? inspectingProduct.originalPrice ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60">MRP Original:</span>
                    <span className="font-bold text-foreground/70 line-through">₹{(inspectingProduct.originalPrice ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60">Stock Available:</span>
                    <span className="font-extrabold text-emerald-600">{inspectingProduct.stockQuantity ?? inspectingProduct.stock_quantity ?? 0} units</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-2xl space-y-2 border border-border/40">
                  <span className="font-bold text-foreground/60 block flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-rose-500" /> Shipping & Logistics:</span>
                  <p className="text-foreground/80">
                    Dispatch: {inspectingProduct.dispatch_days ?? 1} day(s) | Shipping: ₹{inspectingProduct.shipping_charge ?? 0} | COD: {inspectingProduct.is_cod_available ? 'Yes' : 'No'}
                  </p>
                </div>

                <div className="p-4 bg-muted/20 rounded-2xl space-y-2 border border-border/40">
                  <span className="font-bold text-foreground/60 block flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Warranty & Policies:</span>
                  <p className="text-foreground/80">
                    {inspectingProduct.return_policy || 'Standard marketplace return policy applies.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Link
                href={`/admin/products/${inspectingProduct.id}/edit`}
                className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors inline-flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Full Specifications</span>
              </Link>

              <div className="flex items-center gap-2">
                {(inspectingProduct.status === 'pending_approval' || inspectingProduct.status === 'pending_review' || inspectingProduct.status === 'rejected') && (
                  <button
                    onClick={() => {
                      handleApprove(inspectingProduct.id);
                      setInspectingProduct(null);
                    }}
                    className="px-5 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    Approve Product
                  </button>
                )}
                {inspectingProduct.status === 'approved' && (
                  <button
                    onClick={() => {
                      handleUnpublish(inspectingProduct.id);
                      setInspectingProduct(null);
                    }}
                    className="px-5 py-2 bg-slate-500/10 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-500/20 transition-colors"
                  >
                    Unpublish Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
