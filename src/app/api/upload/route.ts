import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import ImageModel from "@/models/Image";
import { connectDB } from "@/lib/mongodb";
import formidable from 'formidable';
import { Readable } from 'stream';
import { promises as fs } from 'fs';

// Note: In Next.js App Router, we don't need to export config to disable body parsing
// The App Router doesn't use the built-in body parser by default

// Helper function to parse form data with formidable
const parseForm = async (req: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({
    keepExtensions: true,
    multiples: false,
  });
  
  // Convert the Request to a Node.js IncomingMessage
  const { headers } = req;
  const contentType = headers.get('content-type') || '';
  
  // Get the raw body as a buffer
  const arrayBuffer = await req.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Create a readable stream from the buffer
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  
  // Create a mock IncomingMessage
  const mockReq: any = readable;
  mockReq.headers = {
    'content-type': contentType,
    'content-length': buffer.length.toString(),
  };
  
  // Parse the form
  return new Promise((resolve, reject) => {
    form.parse(mockReq, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export async function POST(req: Request) {
  try {
    // Log request headers for debugging
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    console.log("Content-Type:", req.headers.get("content-type"));
    
    // Connect to DB
    await connectDB();
    console.log("✅ MongoDB connected");
    
    // Parse the form data using formidable
    const { fields, files } = await parseForm(req);
    
    // Debug the parsed form data
    console.log("Form fields:", fields);
    console.log("Form files:", Object.keys(files));
    
    // Find the file key - handle the case where Postman adds a space to the key
    const fileKey = Object.keys(files).find(key => 
      key === 'file' || key === 'file ' || key.toLowerCase().includes('file')
    );
    
    console.log("Found file key:", fileKey);
    
    if (fileKey) {
      console.log("File structure:", typeof files[fileKey], Array.isArray(files[fileKey]));
      if (files[fileKey]) {
        console.log("File properties:", Object.keys(files[fileKey]));
      }
    }
    
    // Handle both formidable v3 and v4 file structure
    // In v3, files is an object with field names as keys and arrays of file objects as values
    // In v4, files is an array of file objects
    const file = fileKey ? (Array.isArray(files[fileKey]) 
      ? files[fileKey][0] 
      : files[fileKey]) : null;
    
    if (!file) {
      return NextResponse.json(
        { 
          error: "No file uploaded", 
          message: "Make sure the form field name is 'file' (without any spaces)",
          availableKeys: Object.keys(files),
          tip: "In Postman, check that there are no trailing spaces in your form field names"
        },
        { status: 400 }
      );
    }
    
    console.log("Uploaded file:", file.originalFilename || file.newFilename);
    
    // Read the file from disk
    const fileBuffer = await fs.readFile(file.filepath);
    
    // Upload to Cloudinary
    const uploadRes = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "my_uploads",
          resource_type: "auto",
          use_filename: true,
          unique_filename: true
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      // Create readable stream from buffer
      const readable = new Readable();
      readable._read = () => {};
      readable.push(fileBuffer);
      readable.push(null);
      
      readable.pipe(uploadStream);
    });
    
    // Clean up the temp file
    await fs.unlink(file.filepath);
    
    // Save to MongoDB
    const newImage = await ImageModel.create({
      url: (uploadRes as any).secure_url,
      public_id: (uploadRes as any).public_id,
      original_filename: file.originalFilename || file.newFilename || "unknown",
      size: file.size || 0,
      format: (uploadRes as any).format,
    });
    
    return NextResponse.json({ 
      success: true, 
      image: newImage,
      url: (uploadRes as any).secure_url,
      message: "File uploaded successfully"
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    
    // Provide more detailed error information
    let errorMessage = "Upload failed";
    let errorDetails = String(error);
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || String(error);
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails,
        message: "There was an error processing your upload. Please check the file and try again."
      },
      { status: 500 }
    );
  }
}
