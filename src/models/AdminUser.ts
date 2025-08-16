import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAdminUser extends Document {
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
}

const adminUserSchema = new Schema<IAdminUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },  
  phone: { type: String },
});

export default models.AdminUser || model<IAdminUser>('AdminUser', adminUserSchema);
