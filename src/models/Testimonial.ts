import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ITestimonial extends Document {
  client_name: string;
  text: string;
  image_url?: string;
}

const testimonialSchema = new Schema<ITestimonial>({
  client_name: { type: String, required: true },
  text: { type: String, required: true },
  image_url: { type: String },
});

export default models.Testimonial || model<ITestimonial>('Testimonial', testimonialSchema);
