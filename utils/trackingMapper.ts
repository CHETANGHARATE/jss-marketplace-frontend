export interface CanonicalTrackingStage {
  key: string;
  label: string;
  description: string;
}

export const CANONICAL_TRACKING_STAGES: CanonicalTrackingStage[] = [
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    description: 'Order confirmed and sent to fulfillment centre',
  },
  {
    key: 'packed',
    label: 'Packed & Ready',
    description: 'Items verified, securely packed and ready for dispatch',
  },
  {
    key: 'shipped',
    label: 'Shipped (AWB Generated)',
    description: 'Package handed over to logistics partner and tracking generated',
  },
  {
    key: 'in_transit',
    label: 'In Transit',
    description: 'Consignment moving through logistics hubs to delivery facility',
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Delivery associate assigned and out for final delivery',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Package successfully delivered to the customer',
  },
];

export interface ResolvedTrackingState {
  currentIndex: number;
  currentStage: CanonicalTrackingStage;
  progressPercentage: number;
  isCancelled: boolean;
  courierName: string;
  trackingNumber: string;
  hasAwb: boolean;
}

export function resolveCanonicalTrackingState(
  orderStatus?: string,
  shipmentStatus?: string,
  courierName?: string | null,
  trackingNumber?: string | null
): ResolvedTrackingState {
  const normOrderStatus = (orderStatus || '').toLowerCase().trim();
  const normShipmentStatus = (shipmentStatus || '').toLowerCase().trim();

  const isCancelled = normOrderStatus === 'cancelled' || normShipmentStatus === 'failed';

  let stageKey = 'confirmed';

  if (normShipmentStatus === 'delivered' || normOrderStatus === 'delivered') {
    stageKey = 'delivered';
  } else if (normShipmentStatus === 'out_for_delivery') {
    stageKey = 'out_for_delivery';
  } else if (normShipmentStatus === 'in_transit') {
    stageKey = 'in_transit';
  } else if (
    normShipmentStatus === 'picked_up' ||
    normShipmentStatus === 'shipped' ||
    normOrderStatus === 'shipped'
  ) {
    stageKey = 'shipped';
  } else if (
    normShipmentStatus === 'packed' ||
    normOrderStatus === 'packed' ||
    normOrderStatus === 'processing'
  ) {
    stageKey = 'packed';
  } else {
    stageKey = 'confirmed';
  }

  const foundIndex = CANONICAL_TRACKING_STAGES.findIndex((s) => s.key === stageKey);
  const currentIndex = foundIndex === -1 ? 0 : foundIndex;
  const progressPercentage = Math.round((currentIndex / (CANONICAL_TRACKING_STAGES.length - 1)) * 100);

  const cleanTracking = (trackingNumber || '').trim();
  // Filter out any leftover fake test mock numbers or placeholder text
  const isMockOrEmpty =
    !cleanTracking ||
    cleanTracking === 'AWB-8492049182' ||
    cleanTracking.toLowerCase().includes('pending');

  const hasAwb = !isMockOrEmpty;
  const resolvedAwb = hasAwb ? cleanTracking : 'AWB Pending (Generated on Dispatch)';

  const cleanCourier = (courierName || '').trim();
  const isMockCourier = !cleanCourier || cleanCourier === 'BlueDart Express Logistics';
  const resolvedCourier = isMockCourier ? 'Standard Express Logistics (Assigned on Packing)' : cleanCourier;

  return {
    currentIndex,
    currentStage: CANONICAL_TRACKING_STAGES[currentIndex],
    progressPercentage,
    isCancelled,
    courierName: resolvedCourier,
    trackingNumber: resolvedAwb,
    hasAwb,
  };
}
