import {
  BE_DeliveryPrice,
  BE_Locations,
  BE_RequestDeliveryData,
} from "@/helpers/types";
import API from ".";

export const getLocations = async () => {
  const response = await API.get(`/locations`);

  return response.data.data as BE_Locations[];
};

export const getDeliveryPrice = async (data: BE_DeliveryPrice) => {
  const response = await API.post(`/deliveries/price`, data);

  return response.data.data as { price: number };
};

export const requestDelivery = async (data: BE_RequestDeliveryData) => {
  const response = await API.post(`/deliveries`, data);

  return response.data;
};
