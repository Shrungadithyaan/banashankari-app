import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
});

export default models.Category || model<ICategory>('Category', categorySchema);
