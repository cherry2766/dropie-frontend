import api from "@/lib/api";
import type { AddressEntity, AddAddressRequest, AddAddressResponse, UpdateAddressRequest } from "@/types/address";

export async function getAddresses(): Promise<AddressEntity[]> {
  const res = await api.get<AddressEntity[]>("/users/me/addresses");
  return res.data;
}

export async function addAddress(data: AddAddressRequest): Promise<AddAddressResponse> {
  const res = await api.post<AddAddressResponse>("/users/me/addresses", data);
  return res.data;
}

export async function updateAddress(addressId: number, data: UpdateAddressRequest): Promise<void> {
  await api.patch(`/users/me/addresses/${addressId}`, data);
}

export async function deleteAddress(addressId: number): Promise<void> {
  await api.delete(`/users/me/addresses/${addressId}`);
}
