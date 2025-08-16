import cloudinary from '@/lib/cloudinary'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file = data.get('file') as File

  if (!file) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 })
  }

  // Convert file to buffer/base64
  const buffer = Buffer.from(await file.arrayBuffer())
  const base64String = buffer.toString('base64')
  const dataUri = `data:${file.type};base64,${base64String}`

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "banashankari_products"
    })
    return Response.json({ url: result.secure_url }, { status: 200})
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500})
  }
}
