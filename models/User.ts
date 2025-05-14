// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  fullName: string; 
  email: string;
  password: string;
  role: 'user' | 'admin';
  lastLogin?: Date; 
  comparePassword(password: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);


userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
