import db from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";

export class UserService {
  static async findByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
    });
  }

  static async findById(id: string) {
    return db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  static async authenticate(email: string, passwordPlain: string) {
    const user = await this.findByEmail(email);
    if (!user || !user.isActive) return null;

    const isValid = await verifyPassword(passwordPlain, user.passwordHash);
    if (!isValid) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
