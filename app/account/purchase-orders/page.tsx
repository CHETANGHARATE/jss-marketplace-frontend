'use client';

import React, { useEffect, useState } from 'react';
import { AccountSidebar } from '@/components/AccountSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { b2bService, PurchaseOrder, ProformaInvoice } from '@/services/b2bService';
import { useToast } from '@/components/Toast';
import {
  FileCheck,
  Download,
  Building2,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function PurchaseOrdersPage() {
  const [activeTab, setActiveTab] = useState<'po' | 'proforma'>('po');
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [proformas, setProformas] = useState<ProformaInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPo, setSelectedPo] = useState<string | null>(null);
  const [generatingPi, setGeneratingPi] = useState<number | null>(null);

  const { success, error: toastError, info } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [poList, piList] = await Promise.all([
        b2bService.getPurchaseOrders().catch(() => []),
        b2bService.getProformaInvoices().catch(() => []),
      ]);
      setPos(poList || []);
      setProformas(piList || []);
    } catch (err) {
      console.error('Failed to load POs / PIs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownloadPoPdf = (poNumber: string) => {
    info(`Downloading Purchase Order PDF for #${poNumber}...`, 'Generating Document');
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    window.open(`${apiBase}/purchase-orders/${poNumber}/pdf`, '_blank');
  };

  const handleDownloadPiPdf = (proformaNumber: string) => {
    info(`Downloading Proforma Invoice PDF for #${proformaNumber}...`, 'Generating Document');
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    window.open(`${apiBase}/proforma-invoices/${proformaNumber}/pdf`, '_blank');
  };

  const handleGenerateProforma = async (poId: number) => {
    setGeneratingPi(poId);
    try {
      const pi = await b2bService.createProformaInvoice(poId);
      success(`Proforma Invoice #${pi.proforma_number} generated!`, 'PI Created');
      fetchData();
      setActiveTab('proforma');
    } catch (err: any) {
      toastError('Failed to generate proforma invoice.', 'Error');
    } finally {
      setGeneratingPi(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'Purchase Orders & Proforma Invoices' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <main className="flex-1 w-full space-y-6">
          <div className="p-6 bg-card border border-border/60 rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">Purchase Orders & Proforma Invoices</h1>
                  <p className="text-xs text-muted-foreground">
                    Download legally compliant B2B purchase orders and proforma tax estimation documents.
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 p-1 bg-background-secondary rounded-2xl border border-border/50 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('po')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'po'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Purchase Orders ({pos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('proforma')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'proforma'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Proforma Invoices ({proformas.length})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Loading documents...</p>
              </div>
            ) : activeTab === 'po' ? (
              pos.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <FileCheck className="w-12 h-12 mx-auto text-muted-foreground/40" />
                  <h3 className="font-bold text-base text-foreground">No Purchase Orders Issued</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    When you accept an RFQ quotation, an official Purchase Order is generated here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pos.map((po) => {
                    const isExpanded = selectedPo === po.po_number;

                    return (
                      <div
                        key={po.id}
                        className="border border-border/60 rounded-2xl overflow-hidden bg-background-secondary transition-all"
                      >
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-sm text-primary">#{po.po_number}</span>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {po.status}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                Issued: {new Date(po.created_at).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-foreground">
                              Supplier: {po.seller?.vendor_store?.store_name || po.seller?.name || 'Verified Vendor'}
                            </h4>
                            <span className="text-[11px] text-muted-foreground block">
                              Payment Terms: <strong>{po.payment_terms}</strong> • Delivery: <strong>{po.delivery_terms}</strong>
                            </span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                            <div className="text-left sm:text-right pr-2">
                              <span className="text-[11px] text-muted-foreground block">Grand Total</span>
                              <span className="text-base font-black text-foreground">
                                ₹{Number(po.total_amount).toLocaleString('en-IN')}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDownloadPoPdf(po.po_number)}
                              className="px-3.5 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-xl shadow-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all shrink-0"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>PO PDF</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleGenerateProforma(po.id)}
                              disabled={generatingPi === po.id}
                              className="px-3.5 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-xs flex items-center gap-1.5 hover:bg-blue-700 transition-all shrink-0"
                            >
                              {generatingPi === po.id ? (
                                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <FileText className="w-3.5 h-3.5" />
                              )}
                              <span>Proforma</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : proformas.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <h3 className="font-bold text-base text-foreground">No Proforma Invoices Generated</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Proforma Invoices generated for advance remittance and customs declaration will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {proformas.map((pi) => (
                  <div
                    key={pi.id}
                    className="p-4 sm:p-5 border border-border/60 rounded-2xl bg-background-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                          #{pi.proforma_number}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {pi.status}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Date: {new Date(pi.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground">
                        Vendor: {pi.seller?.vendor_store?.store_name || pi.seller?.name || 'Verified Supplier'}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Instructions: {pi.payment_instructions || 'Remit to JSS Escrow Account'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <div className="text-left sm:text-right pr-2">
                        <span className="text-[11px] text-muted-foreground block">Invoice Total</span>
                        <span className="text-base font-black text-foreground">
                          ₹{Number(pi.total_amount).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadPiPdf(pi.proforma_number)}
                        className="px-3.5 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-xs flex items-center gap-1.5 hover:bg-blue-700 transition-all shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PI PDF</span>
                      </button>
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
