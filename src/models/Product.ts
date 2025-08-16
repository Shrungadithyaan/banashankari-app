import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  dimensions: string;
  materials: string;
  care_instructions: string;
  inventory_count: number;
  notes: string;
  images: string[]; // Cloudinary image URLs
}

// Define the schema
const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  dimensions: String,
  materials: String,
  care_instructions: String,
  inventory_count: { type: Number, default: 0 },
  notes: String,
  images: [{ type: String }],
});

// Export the model
export default models.Product || model<IProduct>('Product', productSchema);
