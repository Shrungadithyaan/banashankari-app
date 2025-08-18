import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const order = await Order.findById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const data = await request.json();
  const updated = await Order.findByIdAndUpdate(id, data, { new: true });
  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = await context.params;
  const deleted = await Order.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Order deleted successfully." });
}
