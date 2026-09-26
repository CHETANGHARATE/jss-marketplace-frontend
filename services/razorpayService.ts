export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    animation?: boolean;
  };
}

export const razorpayService = {
  loadSdk(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  async openCheckout(options: RazorpayOptions): Promise<void> {
    const isLoaded = await this.loadSdk();
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load. Please verify your internet connection or disable ad-blockers.');
    }

    const defaultTheme = {
      color: '#0d9488', // Emerald / Teal matching JSSSolutions theme
    };

    const mergedOptions = {
      ...options,
      theme: { ...defaultTheme, ...options.theme },
    };

    const razorpay = new (window as any).Razorpay(mergedOptions);
    razorpay.open();
  },
};
