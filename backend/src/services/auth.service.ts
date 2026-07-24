import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';
import { LoginInput } from '../schemas/auth.schema';

export const login = async (input: LoginInput) => {
  const admin = await Admin.findOne({ email: input.email.toLowerCase() }).select('+passwordHash');

  // Same error for "no such admin" and "wrong password" — don't leak
  // which one it was.
  if (!admin) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(input.password, admin.passwordHash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken({
    id: admin._id.toString(),
    username: admin.username,
    email: admin.email,
  });

  return {
    token,
    admin: {
      id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
    },
  };
};

export const getCurrentAdmin = async (id: string) => {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }
  return {
    id: admin._id.toString(),
    username: admin.username,
    email: admin.email,
    createdAt: admin.createdAt,
  };
};
