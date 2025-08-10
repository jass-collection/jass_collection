import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../../lib/auth';
import { getProductById, updateProduct, deleteProduct } from '../../../../../lib/data';

// Middleware to check admin access
async function checkAdminAuth(request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return [name, value];
    })
  );

  const token = cookies['auth-token'];
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return null;
  }

  return decoded;
}

export async function GET(request, { params }) {
  try {
    // Check admin authentication
    const user = await checkAdminAuth(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const product = await getProductById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Check admin authentication
    const user = await checkAdminAuth(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updatedProduct = await updateProduct(params.id, body);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check admin authentication
    const user = await checkAdminAuth(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const success = await deleteProduct(params.id);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

