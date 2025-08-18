import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }
  return NextResponse.json(testimonial);
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const data = await request.json();
  const updated = await Testimonial.findByIdAndUpdate(id, data, { new: true });
  if (!updated) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const deleted = await Testimonial.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Testimonial deleted successfully." });
}
