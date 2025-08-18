import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// POST: Registration and Login
export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  const { email, password, name, phone } = data;

  // Login
  if (data.action === 'login') {
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Login successful', user: { id: user._id, email: user.email, name: user.name } });
  }

  // Register
  if (data.action === 'register') {
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

// PUT: Password Update
export async function PUT(request: NextRequest) {
  await connectDB();
  const { email, currentPassword, newPassword } = await request.json();
  // Validate input
  if (!email || !currentPassword || !newPassword) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  // Find admin by email
  const user = await AdminUser.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  // Verify current password
  const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!passwordMatch) {
    return NextResponse.json({ error: "Incorrect current password." }, { status: 401 });
  }
  // Hash and update new password
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.password_hash = hashed;
  await user.save();
  return NextResponse.json({ message: "Password updated successfully." });
}
