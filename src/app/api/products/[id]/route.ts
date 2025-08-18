import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const product = await Product.findById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const data = await request.json();
  const updated = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!updated) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Product deleted successfully." });
}
