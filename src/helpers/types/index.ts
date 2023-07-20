export interface SelectOptionsType {
  label: string;
  value: string;
}

export interface DisclosureProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  isControlled: boolean;
  getButtonProps: (props?: any) => any;
  getDisclosureProps: (props?: any) => any;
}

export interface LocalStorageDeliveryLocationProp {
  id: string;
  name: string;
  phone: string;
  state: string;
  area: string;
  address: string;

  notes?: string;
  phone2?: string;
  email?: string;
}

export interface DeliveryLocationFormData {
  id: string;
  name: string;
  phone: string;
  state: string;
  area: string;
  address: string;

  date?: string;
  notes?: string;
  phone2?: string;
  email?: string;
}

export interface BE_Locations {
  state: string;
  locals: {
    name: string;
    locationCode: string;
  }[];
}

export interface BE_DeliveryPrice {
  pickupCode: string;
  dropoffCode: string;
  pickupDate: string;
  pickupGeo?: {
    lat: string;
    long: string;
  };
  dropoffGeo?: {
    lat: string;
    long: string;
  };
}

export interface BE_RequestDeliveryData {
  pickup: {
    address: string;
    locationCode: string;
    pickupName: string;
    pickupNumber: string;
    pickupDate: string;
    altPickupNumber?: string;
    note?: string;
  };
  drops: {
    locationCode: string;
    address: string;
    recipientName: string;
    recipientNumber: string;
    altRecipientNumber?: string;
    note?: string;
  }[];
  customerId?: string;
}
