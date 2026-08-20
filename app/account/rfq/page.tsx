'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AccountSidebar } from '@/components/AccountSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { b2bService, Rfq, Quotation } from '@/services/b2bService';
import { useToast } from '@/components/Toast';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Building2,
  DollarSign,
  Truck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

export default function AccountRfqPage() {
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRfq, setSelectedRfq] = useState<Rfq | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // RFQ Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [rfqTitle, setRfqTitle] = useState('');
  const [rfqDescription, setRfqDescription] = useState('');
  const [rfqQuantity, setRfqQuantity] = useState(50);
  const [rfqTargetPrice, setRfqTargetPrice] = useState('');
  const [rfqLocation, setRfqLocation] = useState('');
  const [rfqDeliveryDate, setRfqDeliveryDate] = useState('');

  // Counter Offer Modal State
  const [counterQuotation, setCounterQuotation] = useState<Quotation | null>(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [countering, setCountering] = useState(false);

  const { success, error: toastError, info } = useToast();

  const fetchRfqs = async () => {
    setLoading(true);
    try {
      const data = await b2bService.getRfqs();
      setRfqs(data || []);
    } catch (err) {
      console.error('Failed to load RFQs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const handleSelectRfq = async (rfqNumber: string) => {
    if (selectedRfq && selectedRfq.rfq_number === rfqNumber) {
      setSelectedRfq(null);
      return;
    }

    setDetailsLoading(true);
    try {
      const data = await b2bService.getRfqDetails(rfqNumber);
      setSelectedRfq(data);
    } catch (err) {
      console.error('Failed to load RFQ details', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCreateRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      await b2bService.createRfq({
        title: rfqTitle,
        description: rfqDescription,
        quantity: Number(rfqQuantity),
        target_unit_price: rfqTargetPrice ? parseFloat(rfqTargetPrice) : undefined,
        delivery_location: rfqLocation,
        required_delivery_date: rfqDeliveryDate || undefined,
      });

      success('RFQ submitted! Verified suppliers in this category have been notified.', 'RFQ Published');
      setIsModalOpen(false);
      setRfqTitle('');
      setRfqDescription('');
      fetchRfqs();
    } catch (err: any) {
      toastError(err.response?.data?.message || 'Failed to submit RFQ', 'Error');
    } finally {
      setCreating(false);
    }
  };

  const handleAcceptQuotation = async (quotationId: number) => {
    try {
      await b2bService.acceptQuotation(quotationId);
      success('Quotation accepted! You can now generate an official Purchase Order.', 'Quotation Accepted');
      if (selectedRfq) {
        handleSelectRfq(selectedRfq.rfq_number);
      }
    } catch (err: any) {
      toastError('Failed to accept quotation.', 'Error');
    }
  };

  const handleCounterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterQuotation) return;
    setCountering(true);

    try {
      await b2bService.counterQuotation(
        counterQuotation.id,
        parseFloat(counterPrice),
        counterMessage
      );
      success('Counter-offer sent to the seller.', 'Counter Offer Submitted');
      setCounterQuotation(null);
      if (selectedRfq) {
        handleSelectRfq(selectedRfq.rfq_number);
      }
    } catch (err: any) {
      toastError('Failed to submit counter-offer.', 'Error');
    } finally {
      setCountering(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'Requests for Quotation (RFQ)' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <main className="flex-1 w-full space-y-6">
          <div className="p-6 bg-card border border-border/60 rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">Bulk Quotes & RFQs</h1>
                  <p className="text-xs text-muted-foreground">
                    Submit custom volume requirements and compare competitive quotations from verified suppliers.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-2xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New RFQ</span>
              </button>
            </div>

            {/* RFQ List */}
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Loading your RFQs...</p>
              </div>
            ) : rfqs.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <h3 className="font-bold text-base text-foreground">No RFQs Submitted Yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Create a Request for Quotation to receive discounted bulk offers directly from verified manufacturers.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {rfqs.map((rfq) => {
                  const isExpanded = selectedRfq?.rfq_number === rfq.rfq_number;

                  return (
                    <div
                      key={rfq.id}
                      className="border border-border/60 rounded-2xl overflow-hidden bg-background-secondary transition-all"
                    >
                      <div
                        onClick={() => handleSelectRfq(rfq.rfq_number)}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-card/70 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-sm text-primary">#{rfq.rfq_number}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                              {rfq.status.replace(/_/g, ' ')}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              {rfq.quotations_count || rfq.quotations?.length || 0} Quotations Received
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-foreground">{rfq.title}</h4>
                          <span className="text-[11px] text-muted-foreground block">
                            Qty: <strong>{rfq.quantity.toLocaleString('en-IN')} units</strong> • Created on{' '}
                            {new Date(rfq.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                          {rfq.target_unit_price && (
                            <div className="text-left sm:text-right">
                              <span className="text-[11px] text-muted-foreground block">Target Unit Price</span>
                              <span className="text-sm font-black text-foreground">
                                ₹{Number(rfq.target_unit_price).toLocaleString('en-IN')}
                              </span>
                            </div>
                          )}

                          <div className="p-2 rounded-xl bg-card border border-border/50 text-muted-foreground">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Received Quotations Comparison Matrix */}
                      {isExpanded && (
                        <div className="p-5 border-t border-border/60 bg-card space-y-5 animate-fade-in">
                          {detailsLoading ? (
                            <div className="py-6 text-center text-xs text-muted-foreground">
                              Loading seller quotations...
                            </div>
                          ) : !selectedRfq?.quotations || selectedRfq.quotations.length === 0 ? (
                            <div className="py-6 text-center space-y-1">
                              <Clock className="w-8 h-8 text-amber-500 mx-auto mb-1 animate-pulse" />
                              <p className="text-xs font-bold text-foreground">Awaiting Supplier Quotes</p>
                              <p className="text-[11px] text-muted-foreground">
                                We've alerted category suppliers. Quotations will appear here as soon as sellers respond.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Multi-Seller Quotations ({selectedRfq.quotations.length})
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedRfq.quotations.map((q) => (
                                  <div
                                    key={q.id}
                                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                                      q.status === 'accepted'
                                        ? 'bg-emerald-500/5 border-emerald-500/40 ring-1 ring-emerald-500/20'
                                        : 'bg-background-secondary border-border/60'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-orange-500" />
                                        <span className="font-bold text-xs text-foreground">
                                          {q.seller?.vendor_store?.store_name || q.seller?.name || 'Verified Supplier'}
                                        </span>
                                      </div>
                                      <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                          q.status === 'accepted'
                                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-muted text-muted-foreground'
                                        }`}
                                      >
                                        {q.status}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <span className="text-[10px] text-muted-foreground block">Offered Unit Price</span>
                                        <span className="font-extrabold text-base text-foreground">
                                          ₹{Number(q.unit_price).toLocaleString('en-IN')}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[10px] text-muted-foreground block">Total Amount</span>
                                        <span className="font-extrabold text-base text-primary">
                                          ₹{Number(q.total_amount).toLocaleString('en-IN')}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[10px] text-muted-foreground block">Lead Time</span>
                                        <span className="font-bold text-foreground">{q.lead_time_days} days</span>
                                      </div>
                                      <div>
                                        <span className="text-[10px] text-muted-foreground block">Shipping Cost</span>
                                        <span className="font-bold text-foreground">₹{Number(q.shipping_cost || 0)}</span>
                                      </div>
                                    </div>

                                    {q.seller_notes && (
                                      <p className="text-[11px] text-muted-foreground bg-card p-2 rounded-xl border border-border/40 italic">
                                        "{q.seller_notes}"
                                      </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                                      {q.status !== 'accepted' && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setCounterQuotation(q);
                                              setCounterPrice(String(q.unit_price * 0.95));
                                            }}
                                            className="px-3 py-1.5 text-xs font-bold bg-card border border-border hover:border-orange-500 text-foreground rounded-xl transition-all"
                                          >
                                            Counter Offer
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleAcceptQuotation(q.id)}
                                            className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all"
                                          >
                                            Accept Quote
                                          </button>
                                        </>
                                      )}
                                      {q.status === 'accepted' && (
                                        <Link
                                          href={`/account/purchase-orders`}
                                          className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-xl flex items-center gap-1"
                                        >
                                          <span>View Purchase Orders</span>
                                          <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* RFQ Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2 text-foreground font-black text-base">
                <FileText className="w-5 h-5 text-primary" />
                <span>Submit Request for Quotation (RFQ)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-muted-custom hover:text-foreground rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRfq} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Requirement Title / Product *</label>
                <input
                  type="text"
                  required
                  value={rfqTitle}
                  onChange={(e) => setRfqTitle(e.target.value)}
                  placeholder="e.g. 500 Units Industrial Copper Pipes 2-Inch"
                  className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Quantity Required (Units) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={rfqQuantity}
                    onChange={(e) => setRfqQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Target Unit Price (₹ Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={rfqTargetPrice}
                    onChange={(e) => setRfqTargetPrice(e.target.value)}
                    placeholder="e.g. 450.00"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Detailed Technical Specifications *</label>
                <textarea
                  rows={3}
                  required
                  value={rfqDescription}
                  onChange={(e) => setRfqDescription(e.target.value)}
                  placeholder="Mention material grade, dimensions, packaging standards, custom branding, or certification requirements..."
                  className="w-full bg-background border border-border p-3 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary resize-none font-normal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Delivery Location / City</label>
                  <input
                    type="text"
                    value={rfqLocation}
                    onChange={(e) => setRfqLocation(e.target.value)}
                    placeholder="e.g. Pune, Maharashtra"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Required By Date</label>
                  <input
                    type="date"
                    value={rfqDeliveryDate}
                    onChange={(e) => setRfqDeliveryDate(e.target.value)}
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-muted-custom hover:bg-muted rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {creating ? <Sparkles className="w-4 h-4 animate-spin" /> : <span>Publish RFQ</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Counter Offer Modal */}
      {counterQuotation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2 text-foreground font-black text-base">
                <DollarSign className="w-5 h-5 text-orange-500" />
                <span>Make Counter Offer</span>
              </div>
              <button
                type="button"
                onClick={() => setCounterQuotation(null)}
                className="p-1.5 text-muted-custom hover:text-foreground rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCounterSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-foreground/80 block">
                  Proposed Counter Unit Price (₹) * <span className="text-muted-custom font-normal">(Offered: ₹{counterQuotation.unit_price})</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Negotiation Message / Note</label>
                <textarea
                  rows={3}
                  value={counterMessage}
                  onChange={(e) => setCounterMessage(e.target.value)}
                  placeholder="e.g. We are ready to place a repeat order if you can match ₹420/unit with 10 days delivery..."
                  className="w-full bg-background border border-border p-3 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary resize-none font-normal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCounterQuotation(null)}
                  className="px-4 py-2 text-xs font-bold text-muted-custom hover:bg-muted rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={countering}
                  className="px-5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-sm transition-all"
                >
                  Send Counter Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
