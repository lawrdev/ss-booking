import slugifyString from "slugify";
import { LocalStorageDeliveryLocationProp } from "../types";

export const getDeliveryLocations = (): LocalStorageDeliveryLocationProp[] => {
  if (typeof localStorage !== "undefined") {
    const locations = localStorage.getItem("ss_locations");

    if (locations != null) {
      return JSON.parse(locations);
    } else {
      localStorage.setItem("ss_locations", JSON.stringify([]));
      return [] as LocalStorageDeliveryLocationProp[];
    }
  }
  return [] as LocalStorageDeliveryLocationProp[];
};

export const updateDeliveryLocations = (
  locations: LocalStorageDeliveryLocationProp[]
) => {
  localStorage.setItem("ss_locations", JSON.stringify(locations));
};

export const removeDeliveryLocation = (id: string) => {
  const locations: LocalStorageDeliveryLocationProp[] = getDeliveryLocations();

  if (locations.find((item) => item?.id === id) == null) {
    return getDeliveryLocations();
  } else {
    let newLocations = locations.filter((item) => item?.id !== id);
    updateDeliveryLocations(newLocations);
    return getDeliveryLocations();
  }
};

// misc
export const formatPrice = (amount: number) => {
  const CURRENCY_FORMATTER = Intl.NumberFormat(`en-NG`, {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

  return `${CURRENCY_FORMATTER.format(amount)}`;
};

export const slugify = (value: string) => {
  return slugifyString(value, { remove: /[*+~.()'"!:@]/g });
};
