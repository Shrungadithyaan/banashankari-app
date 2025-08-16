import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  await connectDB();
  const categories = await Category.find();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();

  // Optional: Validate data.name here

  const category = await Category.create(data);
  return NextResponse.json(category, { status: 201 });
}
