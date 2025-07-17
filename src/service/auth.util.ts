import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "@/@types/schema";
import { envConfig } from "@/config";

export class AuthUtilsService {
  hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
   comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
   generateToken(user: IUser) {
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name , available: user.available , verfied: user.verfied },
      envConfig.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    return token;
  }

   verifyToken<T = any>(token: string): T {
    return jwt.verify(token, envConfig.JWT_SECRET_KEY) as T;
  }
}
