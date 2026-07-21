export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export const razorpayService = {
  loadSdk(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  async openCheckout(options: RazorpayOptions): Promise<void> {
    const isLoaded = await this.loadSdk();
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
    }

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  },
};
