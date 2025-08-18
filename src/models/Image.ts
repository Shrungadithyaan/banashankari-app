import mongoose, { Schema, Document } from "mongoose";

interface IImage extends Document {
  url: string;
  public_id: string;
}

const ImageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
});

export default mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);
