import { apiClient } from './apiClient';
import { ApiResponse, PaginatedApiResponse } from '../types/api';

// 1. Business Account Interfaces (Features 92 & 93)
export interface BusinessAccount {
  id: number;
  user_id: number;
  legal_business_name: string;
  trade_name?: string | null;
  business_type: string;
  gstin?: string | null;
  pan?: string | null;
  registered_address: string;
  billing_address?: string | null;
  shipping_address?: string | null;
  state?: string | null;
  city?: string | null;
  pincode?: string | null;
  contact_person: string;
  business_email: string;
  business_phone: string;
  website?: string | null;
  annual_turnover?: string | null;
  documents?: Record<string, string> | null;
  status: 'draft' | 'submitted' | 'under_review' | 'verified' | 'rejected' | 'changes_required';
  rejection_reason?: string | null;
  verified_at?: string | null;
  created_at: string;
  user?: any;
}

// 2. Wholesale & Tiered Pricing Interfaces (Features 50 & 52)
export interface ProductPriceTier {
  id: number;
  product_id: number;
  min_quantity: number;
  max_quantity?: number | null;
  unit_price: number;
  is_active: boolean;
}

export interface ProductTiersResponse {
  product_id: number;
  is_wholesale_enabled: boolean;
  wholesale_moq: number;
  tiers: ProductPriceTier[];
}

export interface PriceCalculationResult {
  unit_price: number;
  is_wholesale: boolean;
  tier_applied?: ProductPriceTier | null;
  total_price: number;
  savings_amount: number;
  savings_percent: number;
  moq_validation: {
    valid: boolean;
    moq: number;
    message?: string | null;
  };
}

// 3. RFQ & Quotation Interfaces (Features 51, 82, 83)
export interface RfqItem {
  id?: number;
  product_id?: number;
  product_name: string;
  specifications?: string;
  quantity: number;
  target_price?: number;
}

export interface QuotationNegotiation {
  id: number;
  quotation_id: number;
  user_id: number;
  actor_type: 'buyer' | 'seller';
  offer_price: number;
  quantity?: number;
  message?: string;
  status: string;
  created_at: string;
  user?: any;
}

export interface Quotation {
  id: number;
  quotation_number: string;
  rfq_id: number;
  seller_id: number;
  unit_price: number;
  quantity: number;
  moq: number;
  lead_time_days: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  valid_until?: string;
  seller_notes?: string;
  attachments?: string[];
  status: 'submitted' | 'accepted' | 'rejected' | 'countered' | 'expired' | 'withdrawn';
  created_at: string;
  seller?: any;
  negotiations?: QuotationNegotiation[];
}

export interface Rfq {
  id: number;
  rfq_number: string;
  user_id: number;
  category_id?: number;
  product_id?: number;
  title: string;
  description: string;
  quantity: number;
  target_unit_price?: number;
  delivery_location?: string;
  delivery_pincode?: string;
  required_delivery_date?: string;
  attachments?: string[];
  status: 'submitted' | 'quotation_received' | 'negotiation' | 'accepted' | 'rejected' | 'expired' | 'cancelled' | 'converted_to_po';
  created_at: string;
  category?: any;
  product?: any;
  user?: any;
  quotations?: Quotation[];
  quotations_count?: number;
  items?: RfqItem[];
}

// 4. Purchase Order & Proforma Invoice Interfaces (Features 88 & 95)
export interface PurchaseOrderItem {
  id: number;
  purchase_order_id: number;
  product_id?: number;
  product_name: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  tax_percent: number;
  total_price: number;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  quotation_id?: number;
  rfq_id?: number;
  buyer_id: number;
  seller_id: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  payment_terms: string;
  delivery_terms: string;
  billing_address?: any;
  shipping_address?: any;
  notes?: string;
  status: 'draft' | 'issued' | 'accepted' | 'rejected' | 'partially_fulfilled' | 'fulfilled' | 'cancelled';
  issued_at?: string;
  accepted_at?: string;
  created_at: string;
  buyer?: any;
  seller?: any;
  items?: PurchaseOrderItem[];
  proforma_invoice?: ProformaInvoice;
}

export interface ProformaInvoice {
  id: number;
  proforma_number: string;
  purchase_order_id?: number;
  buyer_id: number;
  seller_id: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  buyer_details?: any;
  seller_details?: any;
  items_snapshot?: any[];
  payment_instructions?: string;
  valid_until?: string;
  status: 'generated' | 'sent' | 'paid' | 'expired' | 'converted_to_tax_invoice';
  created_at: string;
  buyer?: any;
  seller?: any;
  purchase_order?: PurchaseOrder;
}

// 5. Business Credit Interfaces (Feature 94)
export interface BusinessCreditTransaction {
  id: number;
  business_credit_account_id: number;
  type: 'credit_assigned' | 'order_deduction' | 'repayment' | 'credit_refund' | 'adjustment';
  amount: number;
  balance_after: number;
  reference_type?: string;
  reference_id?: string;
  notes?: string;
  created_at: string;
}

export interface BusinessCreditAccount {
  id: number;
  user_id: number;
  credit_limit: number;
  available_credit: number;
  used_credit: number;
  repayment_due_days: number;
  status: 'inactive' | 'pending' | 'active' | 'suspended';
  admin_notes?: string;
  approved_at?: string;
  created_at: string;
  transactions?: BusinessCreditTransaction[];
  user?: any;
}

// 6. Buyer Requirements, Seller Bids & Sample Requests (Features 84, 85, 86, 87)
export interface SellerBid {
  id: number;
  buyer_requirement_id: number;
  seller_id: number;
  bid_unit_price: number;
  moq: number;
  lead_time_days: number;
  shipping_cost: number;
  message?: string;
  status: 'submitted' | 'accepted' | 'rejected';
  created_at: string;
  seller?: any;
}

export interface BuyerRequirement {
  id: number;
  requirement_number: string;
  user_id: number;
  category_id?: number;
  title: string;
  description: string;
  quantity: number;
  target_price?: number;
  delivery_pincode?: string;
  required_date?: string;
  attachments?: string[];
  status: 'published' | 'closed' | 'expired';
  created_at: string;
  category?: any;
  user?: any;
  bids?: SellerBid[];
  bids_count?: number;
}

export interface SampleRequest {
  id: number;
  sample_request_number: string;
  product_id: number;
  buyer_id: number;
  seller_id: number;
  quantity: number;
  sample_price: number;
  shipping_address?: any;
  notes?: string;
  status: 'requested' | 'approved' | 'shipped' | 'delivered' | 'rejected';
  courier_name?: string;
  tracking_number?: string;
  created_at: string;
  product?: any;
  buyer?: any;
  seller?: any;
}

export const b2bService = {
  // Feature 92 & 93: Business Account
  async getBusinessAccount(): Promise<{ data: BusinessAccount | null; is_business_buyer: boolean }> {
    const response = await apiClient.get<ApiResponse<BusinessAccount>>('/business/account');
    return {
      data: response.data.data,
      is_business_buyer: Boolean((response.data as any).is_business_buyer),
    };
  },

  async saveBusinessAccount(payload: Partial<BusinessAccount>): Promise<BusinessAccount> {
    const response = await apiClient.post<ApiResponse<BusinessAccount>>('/business/account', payload);
    return response.data.data;
  },

  async getAdminBusinessBuyers(status?: string): Promise<BusinessAccount[]> {
    const url = status ? `/admin/business/buyers?status=${status}` : '/admin/business/buyers';
    const response = await apiClient.get<ApiResponse<BusinessAccount[]>>(url);
    return response.data.data || [];
  },

  async verifyBusinessBuyer(id: number, status: 'verified' | 'rejected' | 'changes_required', rejectionReason?: string): Promise<BusinessAccount> {
    const response = await apiClient.patch<ApiResponse<BusinessAccount>>(`/admin/business/buyers/${id}/verify`, {
      status,
      rejection_reason: rejectionReason,
    });
    return response.data.data;
  },

  // Feature 50 & 52: Product Tiers & Pricing
  async getProductTiers(productId: number): Promise<ProductTiersResponse> {
    const response = await apiClient.get<ApiResponse<ProductTiersResponse>>(`/products/${productId}/tiers`);
    return response.data.data;
  },

  async calculateProductPrice(productId: number, quantity: number, wholesale: boolean = false): Promise<PriceCalculationResult> {
    const response = await apiClient.get<ApiResponse<PriceCalculationResult>>(`/products/${productId}/calculate-price?quantity=${quantity}&wholesale=${wholesale ? 1 : 0}`);
    return response.data.data;
  },

  async syncProductTiers(productId: number, payload: { is_wholesale_enabled: boolean; wholesale_moq: number; tiers: Array<{ min_quantity: number; max_quantity?: number | null; unit_price: number }> }): Promise<any> {
    const response = await apiClient.put<ApiResponse<any>>(`/admin/products/${productId}/tiers`, payload);
    return response.data.data;
  },

  // Features 51, 82, 83: RFQs & Quotations
  async getRfqs(): Promise<Rfq[]> {
    const response = await apiClient.get<ApiResponse<Rfq[]>>('/rfq');
    return response.data.data || [];
  },

  async createRfq(payload: {
    title: string;
    description: string;
    category_id?: number;
    product_id?: number;
    quantity: number;
    target_unit_price?: number;
    delivery_location?: string;
    delivery_pincode?: string;
    required_delivery_date?: string;
    attachments?: string[];
  }): Promise<Rfq> {
    const response = await apiClient.post<ApiResponse<Rfq>>('/rfq', payload);
    return response.data.data;
  },

  async getRfqDetails(rfqNumber: string): Promise<Rfq> {
    const response = await apiClient.get<ApiResponse<Rfq>>(`/rfq/${rfqNumber}`);
    return response.data.data;
  },

  async getSellerRfqInbox(): Promise<Rfq[]> {
    const response = await apiClient.get<ApiResponse<Rfq[]>>('/vendor/rfq/inbox');
    return response.data.data || [];
  },

  async submitQuotation(rfqId: number, payload: {
    unit_price: number;
    quantity: number;
    moq?: number;
    lead_time_days: number;
    shipping_cost?: number;
    tax_amount?: number;
    valid_until?: string;
    seller_notes?: string;
  }): Promise<Quotation> {
    const response = await apiClient.post<ApiResponse<Quotation>>(`/vendor/rfq/${rfqId}/quote`, payload);
    return response.data.data;
  },

  async counterQuotation(quotationId: number, offerPrice: number, message?: string, quantity?: number): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(`/quotations/${quotationId}/counter`, {
      offer_price: offerPrice,
      message,
      quantity,
    });
    return response.data.data;
  },

  async acceptQuotation(quotationId: number): Promise<Quotation> {
    const response = await apiClient.post<ApiResponse<Quotation>>(`/quotations/${quotationId}/accept`);
    return response.data.data;
  },

  async rejectQuotation(quotationId: number): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(`/quotations/${quotationId}/reject`);
    return response.data;
  },

  // Feature 88 & 95: Purchase Orders & Proforma Invoices
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const response = await apiClient.get<ApiResponse<PurchaseOrder[]>>('/purchase-orders');
    return response.data.data || [];
  },

  async createPurchaseOrder(quotationId: number, payload?: {
    payment_terms?: string;
    delivery_terms?: string;
    billing_address?: any;
    shipping_address?: any;
    notes?: string;
  }): Promise<PurchaseOrder> {
    const response = await apiClient.post<ApiResponse<PurchaseOrder>>('/purchase-orders', {
      quotation_id: quotationId,
      ...payload,
    });
    return response.data.data;
  },

  async getPurchaseOrderDetails(poNumber: string): Promise<PurchaseOrder> {
    const response = await apiClient.get<ApiResponse<PurchaseOrder>>(`/purchase-orders/${poNumber}`);
    return response.data.data;
  },

  async acceptPurchaseOrder(poId: number): Promise<PurchaseOrder> {
    const response = await apiClient.post<ApiResponse<PurchaseOrder>>(`/vendor/purchase-orders/${poId}/accept`);
    return response.data.data;
  },

  async getProformaInvoices(): Promise<ProformaInvoice[]> {
    const response = await apiClient.get<ApiResponse<ProformaInvoice[]>>('/proforma-invoices');
    return response.data.data || [];
  },

  async createProformaInvoice(purchaseOrderId: number, paymentInstructions?: string): Promise<ProformaInvoice> {
    const response = await apiClient.post<ApiResponse<ProformaInvoice>>('/proforma-invoices', {
      purchase_order_id: purchaseOrderId,
      payment_instructions: paymentInstructions,
    });
    return response.data.data;
  },

  async getProformaInvoiceDetails(proformaNumber: string): Promise<ProformaInvoice> {
    const response = await apiClient.get<ApiResponse<ProformaInvoice>>(`/proforma-invoices/${proformaNumber}`);
    return response.data.data;
  },

  // Feature 94: Business Credit / Pay-Later
  async getCreditAccount(): Promise<BusinessCreditAccount | null> {
    const response = await apiClient.get<ApiResponse<BusinessCreditAccount>>('/business-credit');
    return response.data.data;
  },

  async applyForCredit(payload: { requested_limit: number; business_turnover?: string; notes?: string }): Promise<BusinessCreditAccount> {
    const response = await apiClient.post<ApiResponse<BusinessCreditAccount>>('/business-credit/apply', payload);
    return response.data.data;
  },

  async getAdminCreditAccounts(status?: string): Promise<BusinessCreditAccount[]> {
    const url = status ? `/admin/business-credit?status=${status}` : '/admin/business-credit';
    const response = await apiClient.get<ApiResponse<BusinessCreditAccount[]>>(url);
    return response.data.data || [];
  },

  async approveCreditLimit(id: number, payload: { credit_limit: number; repayment_due_days: number; status: string; admin_notes?: string }): Promise<BusinessCreditAccount> {
    const response = await apiClient.patch<ApiResponse<BusinessCreditAccount>>(`/admin/business-credit/${id}/approve`, payload);
    return response.data.data;
  },

  async recordCreditRepayment(id: number, amount: number, referenceId?: string, notes?: string): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(`/admin/business-credit/${id}/repayment`, {
      amount,
      reference_id: referenceId,
      notes,
    });
    return response.data.data;
  },

  // Features 84, 85, 86, 87: Requirements & Samples
  async getRequirements(categoryId?: number): Promise<BuyerRequirement[]> {
    const url = categoryId ? `/b2b/requirements?category_id=${categoryId}` : '/b2b/requirements';
    const response = await apiClient.get<ApiResponse<BuyerRequirement[]>>(url);
    return response.data.data || [];
  },

  async postRequirement(payload: {
    title: string;
    description: string;
    category_id?: number;
    quantity: number;
    target_price?: number;
    delivery_pincode?: string;
    required_date?: string;
    attachments?: string[];
  }): Promise<BuyerRequirement> {
    const response = await apiClient.post<ApiResponse<BuyerRequirement>>('/b2b/requirements', payload);
    return response.data.data;
  },

  async bidOnRequirement(requirementId: number, payload: {
    bid_unit_price: number;
    moq?: number;
    lead_time_days: number;
    shipping_cost?: number;
    message?: string;
  }): Promise<SellerBid> {
    const response = await apiClient.post<ApiResponse<SellerBid>>(`/b2b/requirements/${requirementId}/bid`, payload);
    return response.data.data;
  },

  async requestSample(payload: { product_id: number; quantity?: number; shipping_address?: any; notes?: string }): Promise<SampleRequest> {
    const response = await apiClient.post<ApiResponse<SampleRequest>>('/b2b/samples', payload);
    return response.data.data;
  },

  async getSampleRequests(): Promise<SampleRequest[]> {
    const response = await apiClient.get<ApiResponse<SampleRequest[]>>('/b2b/samples');
    return response.data.data || [];
  },
};
