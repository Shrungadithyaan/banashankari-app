import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IOrder extends Document {
  client_name: string;
  product: mongoose.Types.ObjectId; // Reference to Product
  category: mongoose.Types.ObjectId; // Reference to Category
  price: number;
  status: string;
  order_date: Date;
  delivery_date: Date;
  phone: string;
  email: string;
  address_street: string;
  city: string;
  state: string;
  postal_code: string;
  notes?: string;
}

const orderSchema = new Schema<IOrder>({
  client_name: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'Processing' },
  order_date: { type: Date, default: Date.now },
  delivery_date: { type: Date },
  phone: { type: String, required: true },
  email: { type: String },
  address_street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postal_code: { type: String, required: true },
  notes: { type: String },
});

export default models.Order || model<IOrder>('Order', orderSchema);
