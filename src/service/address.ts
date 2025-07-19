import { IAddress } from "@/@types/schema";
import { AddressModel } from "@/models/address";

export class AddressService {
  constructor(private readonly addressModel = AddressModel) {}
  async createNewAddress(address: Omit<IAddress, "_id">): Promise<IAddress> {
    return (await this.addressModel.create(address)) as IAddress;
  }
  async updateAddressById(
    addressId: string,
    address: Partial<IAddress>
  ): Promise<IAddress> {
    const filteredAddress = Object.fromEntries(
      Object.entries(address).filter(([key, value]) => value !== undefined)
    );
    return (await this.addressModel.findByIdAndUpdate(
      addressId,
      filteredAddress,
      { new: true }
    )) as IAddress;
  }
  async deleteAddressById(addressId: string): Promise<IAddress> {
    return (await this.addressModel.findByIdAndDelete(addressId)) as IAddress;
  }
  async getAddressById(addressId: string): Promise<IAddress> {
    return (await this.addressModel.findById(addressId)) as IAddress;
  }
  async getAddressByUserId(userId: string): Promise<IAddress[]> {
    return (await this.addressModel.find({ userId })) as IAddress[];
  }
}
