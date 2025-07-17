import { IUser } from "@/@types/schema";
import { UserModel } from "@/models/user";

export class PartnerService {
  constructor(private readonly userModel = UserModel) {}
  getAllPartners() {
    return this.userModel.find({ role: "partner" });
  }
  getPartnerById(id: string) {
    return this.userModel.findById(id);
  }
  updatePartnerById(id: string, data: Partial<IUser>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }
}
