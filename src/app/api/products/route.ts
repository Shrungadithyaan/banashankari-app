import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  await connectDB();
  const products = await Product.find();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  const product = await Product.create(data);
  return NextResponse.json(product, { status: 201 });
}
