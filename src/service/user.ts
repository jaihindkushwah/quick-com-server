import { IUserInput } from "@/@types/api";
import { IUser } from "@/@types/schema";
import { UserModel } from "@/models/user";
import { AuthUtilsService } from "./auth.util";

export class UserService {
  constructor(
    private readonly userModel = UserModel,
    private readonly authUtilsService = new AuthUtilsService()
  ) {}
  async login({ email, password, role }: Omit<IUserInput, "name">) {
    const user = (await this.userModel.findOne({ email, role })) as IUser;
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = this.authUtilsService.comparePassword(
      password,
      user.password
    );
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const token = this.authUtilsService.generateToken(user);
    return token;
  }
  async register({ email, name, password, role }: IUserInput) {
    const user = (await this.userModel.findOne({ email })) as IUser;
    if (user) {
      throw new Error("User already exists");
    }
    const hashedPassword = this.authUtilsService.hashPassword(password);
    const newUser = (await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: role,
    })) as IUser;
    const token = this.authUtilsService.generateToken(newUser);
    return token;
  }
  async verifyOtp(email: IUserInput["email"], otp: string) {}
  async resendOtp(email: IUserInput["email"]) {}
  async resetPassword(email: IUserInput["email"]) {}
  async updatePassword({ email, password }: Omit<IUserInput, "name">) {}
}
