import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { getProducts, addProduct } from '../../../../lib/data';

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

export async function GET(request) {
  try {
    // Check admin authentication
    const user = await checkAdminAuth(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
    const {
      title,
      description,
      price_in_inr,
      price_in_usd,
      price_in_gbp,
      price_in_cad,
      images,
      videos,
      sizes,
      stock,
      countryAvailability
    } = body;

    // Validate required fields
    if (!title || !description || !price_in_usd || !sizes || !Array.isArray(sizes) || sizes.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newProduct = await addProduct({
      title,
      description,
      price_in_inr: price_in_inr || Math.round(price_in_usd * 82), // Approximate conversion
      price_in_usd,
      price_in_gbp: price_in_gbp || Math.round(price_in_usd * 0.79), // Approximate conversion
      price_in_cad: price_in_cad || Math.round(price_in_usd * 1.35), // Approximate conversion
      images: images || [],
      videos: videos || [],
      sizes,
      stock: stock || 0,
      countryAvailability: countryAvailability || ['IN', 'UK', 'CA', 'US']
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  }
}

