import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  await connectDB();
  const testimonials = await Testimonial.find();
  return NextResponse.json(testimonials);
}

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();

  // Optional: Validate testimonial content here

  const testimonial = await Testimonial.create(data);
  return NextResponse.json(testimonial, { status: 201 });
}   
