import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const category = await Category.findById(id);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(category);
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const data = await request.json();
  const updated = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!updated) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Category deleted successfully." });
}
