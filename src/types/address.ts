export type AddressEntity = {
  id: number;
  receiverName: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string;
  label: string;
  isDefault: boolean;
};

export type AddAddressRequest = {
  receiverName: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string;
  label: string;
  isDefault: boolean;
};

export type UpdateAddressRequest = Partial<AddAddressRequest>;

export type AddAddressResponse = {
  id: number;
  receiverName: string;
  isDefault: boolean;
};
