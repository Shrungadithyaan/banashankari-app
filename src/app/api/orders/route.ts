import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  await connectDB();

  // Fetch orders with populated product and category details
  const orders = await Order.find()
    .populate('product')
    .populate('category');

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();

  // Optional: Add validation on order fields here

  const order = await Order.create(data);
  return NextResponse.json(order, { status: 201 });
}
