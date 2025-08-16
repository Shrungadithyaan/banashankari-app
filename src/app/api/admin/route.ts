import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  const { email, password, name, phone } = data;

  // Check if this is a login or registration request
  if (data.action === 'login') {
    // Login logic
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    // TODO: Implement JWT or session generation for authentication token 
    return NextResponse.json({ message: 'Login successful', user: { id: user._id, email: user.email, name: user.name } });
  }

  if (data.action === 'register') {
    // Registration logic (add new admin)
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new AdminUser({ email, name, phone, password_hash: hashedPassword });
    await newUser.save();
    return NextResponse.json({ message: 'Admin user created', user: { id: newUser._id, email: newUser.email, name: newUser.name } }, { status: 201 });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
